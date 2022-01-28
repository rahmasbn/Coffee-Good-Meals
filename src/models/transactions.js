const db = require('../config/db');
const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');

const addTransaction = (body) => {
  return new Promise((resolve, reject) => {
    const list = body.list;
    delete body.list;
    const timeStamp = getTimeStamp();
    body = {
      ...body,
      created_at: timeStamp,
    };
    const sqlAdd = `INSERT INTO transaction SET ?`;
    db.query(sqlAdd, [body], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
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
            result: {err: 'Something went wrong'},
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
          result: {err: 'Something went wrong'},
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
          result: {err: 'Something went wrong'},
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

module.exports = {addTransaction, updateTransaction, deleteTransaction};
