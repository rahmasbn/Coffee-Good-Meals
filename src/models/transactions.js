const db = require('../config/db');
const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');
const {getToday} = require('../helpers/getToday');
const {formatDateDB} = require('../helpers/formatDateDB');

const userTransaction = (query, userInfo) => {
  return new Promise((resolve, reject) => {
    const {page, limit} = query;
    let {id, roles} = userInfo;
    console.log('userinfo', userInfo);
    const sqlPage = !page || page === '' ? '1' : page;
    const sqlLimit = !limit || limit === '' ? '15' : limit;
    const offset = (parseInt(sqlPage) - 1) * parseInt(sqlLimit);
    let deleteAt = 't.deleted_customer_at';
    let userId = 't.user_id = ';
    id = String(id);
    if (roles === '2') {
      deleteAt = 't.deleted_admin_at';
      userId = 'p.user_id ';
      id = 'IS NOT NULL';
    }

    console.log(
      'deleteAt, userId, id, sqlLimit, offset',
      deleteAt,
      userId,
      id,
      sqlLimit,
      offset,
    );
    const prepare = [
      mysql.raw(deleteAt),
      mysql.raw(userId),
      mysql.raw(id),
      mysql.raw(sqlLimit),
      offset,
    ];
    const sqlCount = `SELECT count(*) count
      FROM transaction t LEFT JOIN transaction_products tp ON tp.id = 
      (SELECT id_transaction FROM transaction_products WHERE transaction_products.id_transaction = t.id LIMIT 1)
      JOIN products p ON p.id = tp.id_products
      WHERE ? IS NULL AND ? ? `;
    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      const totalData = result[0].count;
      const nextOffset = parseInt(offset) + parseInt(sqlLimit);
      let nextPage = '?';
      let prevPage = '?';
      const nPage = nextOffset >= totalData ? null : parseInt(sqlPage) + 1;
      const pPage = sqlPage > 1 ? +sqlPage - 1 : null;
      const totalPage = Math.ceil(totalData / parseInt(sqlLimit));
      if (nPage == null) {
        nextPage = null;
      } else {
        const nextCount = parseInt(sqlPage) + 1;
        nextPage += 'page=' + nextCount;
        if (limit) {
          nextPage += '&limit=' + limit;
        }
      }
      if (pPage == null) {
        prevPage = null;
      } else {
        const prevCounter = parseInt(sqlPage) - 1;
        prevPage += 'page=' + prevCounter;
        if (limit) {
          prevPage += '&limit=' + limit;
        }
      }

      const meta = {
        totalData,
        prevPage,
        page: sqlPage,
        nextPage,
        totalPage,
      };
      const sqlSelect = `SELECT t.id, t.user_id, t.total, p.image, p.name 
      FROM transaction t LEFT JOIN transaction_products tp ON tp.id = 
      (SELECT id_transaction FROM transaction_products WHERE transaction_products.id_transaction = t.id LIMIT 1)
      JOIN products p ON p.id = tp.id_products
      WHERE ? IS NULL AND ? ? 
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`;
      db.query(sqlSelect, prepare, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong.'},
          });
        }
        return resolve({
          status: 200,
          result: {
            msg: 'List of user transaction.',
            meta,
            data: {result},
          },
        });
      });
    });
  });
};

const getStatistic = (query) => {
  return new Promise((resolve, reject) => {
    console.log(query);
    const mode = query.mode || 'daily';
    console.log(mode);
    // let sqlGet = '';
    let prepare = [];
    // if (mode === 'daily') {
    const endDate = getToday();
    let tmpDate = new Date(getToday());
    tmpDate.setDate(tmpDate.getDate() - 7);
    const startDate = formatDateDB(tmpDate);
    prepare.push(startDate);
    prepare.push(endDate);
    console.log('start, end', startDate, endDate);
    const sqlGet = `SELECT COALESCE(SUM(total), 0) total, date 
      FROM transaction 
      WHERE date between ? AND ? GROUP BY date ORDER BY date`;
    db.query(sqlGet, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      let x = 0;
      let data = [];
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      // var d = new Date(dateString);
      // var dayName = days[d.getDay()];
      console.log(typeof result[0].date, result[0].date);
      for (let i = 0; i < 7; i++) {
        let day = new Date(startDate);
        day.setDate(day.getDate() + i);
        const formatDate = formatDateDB(day);
        const formatDataDate = formatDateDB(result[x].date);
        console.log('a, b', formatDate, formatDataDate);
        if (formatDate == formatDataDate) {
          const dayName = days[day.getDay()];
          data.push({
            date: formatDate,
            day: dayName,
            income: result[x].total,
          });
          x++;
        } else {
          const dayName = days[day.getDay()];
          data.push({
            date: formatDate,
            day: dayName,
            income: 0,
          });
        }
        if (x == result.length) {
          break;
        }
      }
      console.log(data);
      return resolve({
        status: 200,
        result: {
          msg: 'Add transaction success.',
          result: data,
        },
      });
    });
  });
};

const addTransaction = (body, id) => {
  return new Promise((resolve, reject) => {
    const list = body.list;
    delete body.list;
    const timeStamp = getTimeStamp();
    const date = getToday();
    body = {
      ...body,
      user_id: id,
      created_at: timeStamp,
      date,
    };
    const sqlAdd = `INSERT INTO transaction SET ?`;
    db.query(sqlAdd, [body], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      const id_transaction = result.insertId;
      const sqlAddList = `INSERT INTO 
      transaction_products(id_transaction, id_products, quantity)
      VALUES ? `;
      let values = '';
      console.log('list:', list);
      list.forEach((element, idx) => {
        if (idx === list.length - 1) {
          console.log('element', element);
          values += `(${id_transaction}, ${element.id_products}, ${element.quantity} )`;
        } else {
          values += `(${id_transaction}, ${element.id_products}, ${element.quantity} ), `;
        }
      });
      db.query(sqlAddList, [mysql.raw(values)], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong.'},
          });
        }
        return resolve({
          status: 200,
          result: {
            msg: 'Add transaction success.',
            data: {id_transaction, ...body, products: list},
          },
        });
      });
    });
  });
};

const updateTransaction = (body, id) => {
  return new Promise((resolve, reject) => {
    const sqlUpdate = `UPDATE transaction SET ? WHERE id = ?`;
    db.query(sqlUpdate, [body, id], (err) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      return resolve({
        status: 200,
        result: {msg: 'Update success', data: body},
      });
    });
  });
};

const deleteTransaction = (ids, roles) => {
  return new Promise((resolve, reject) => {
    console.log('id, roles', ids, roles);
    const timeStamp = getTimeStamp();
    const prepare = [];
    const sqlDeleteTransaction = `UPDATE transaction SET ? = ? 
    WHERE id IN (?)`;
    if (roles === '1') {
      prepare.push(mysql.raw('deleted_customer_at'));
    } else {
      prepare.push(mysql.raw('deleted_admin_at'));
    }
    prepare.push(timeStamp);
    let whereIn = '';
    for (let i = 0; i < ids.length; i++) {
      whereIn += i !== ids.length - 1 ? ids[i] + ',' : ids[i];
    }
    prepare.push(mysql.raw(whereIn));
    db.query(sqlDeleteTransaction, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      console.log('result prepare', result, prepare);
      return resolve({
        status: 200,
        result: {msg: 'Transactions deleted.', data: ids},
      });
    });
  });
};

module.exports = {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  userTransaction,
  getStatistic,
};
