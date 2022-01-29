const db = require('../config/db');
// const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');
const {formatDateDB} = require('../helpers/formatDateDB');
const {deleteImage} = require('../helpers/deleteImage');
const {getToday} = require('../helpers/getToday');

const addPromos = (body) => {
  return new Promise((resolve, reject) => {
    const created_at = getTimeStamp();
    if (body.image) {
      console.log('image is not empty', body.image);
      body = {...body, ...{image: body.image}};
    }
    body = {...body, created_at};
    console.log('newBody', body);
    const sqlInsert = `INSERT INTO promo SET ?`;
    db.query(sqlInsert, [body], (err, result) => {
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
          msg: 'Add product success.',
          data: {id: result.insertId, ...body},
        },
      });
    });
  });
};

const getListPromo = () => {
  return new Promise((resolve, reject) => {
    const today = getToday();
    const sqlGetList = `SELECT id, name, description, code, discount, image FROM promo
      WHERE discount_start < ? AND discount_end > ? AND deleted_at IS NULL
      ORDER BY created_at DESC`;
    db.query(sqlGetList, [today, today], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }

      return resolve({status: 200, result: {msg: 'List Promo.', data: result}});
    });
  });
};

const getPromoDetail = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGetList = `SELECT id, name, description, code, 
    discount, discount_start, discount_end, image FROM promo
    WHERE id = ? AND deleted_at IS NULL
    ORDER BY created_at DESC`;
    db.query(sqlGetList, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      if (result.length === 0) {
        return reject({
          status: 404,
          result: {err: `Promo can't be found.`},
        });
      }
      const dateStart = formatDateDB(result[0].discount_start);
      const dateEnd = formatDateDB(result[0].discount_end);
      const data = {
        ...result[0],
        ...{discount_start: dateStart},
        ...{discount_end: dateEnd},
      };
      return resolve({
        status: 200,
        result: {msg: 'Detail Promo.', data: data},
      });
    });
  });
};

const updatePromo = (body, id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = 'SELECT image FROM promo WHERE id = ?';
    db.query(sqlGetImage, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      const imageToDel = result[0].image;
      const sqlUpdatePromo = `UPDATE promo SET ? WHERE id = ?`;
      db.query(sqlUpdatePromo, [body, id], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong'},
          });
        }
        if (imageToDel !== null) {
          deleteImage(imageToDel, 'promos');
        }
        return resolve({
          status: 200,
          result: {msg: 'Update Success', data: body},
        });
      });
    });
  });
};

const deletePromos = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = 'SELECT image FROM promo WHERE id = ?';
    db.query(sqlGetImage, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      const imageToDel = result[0].image;
      console.log('img to del', imageToDel);
      const timeStamp = getTimeStamp();
      const sqlDelete = `UPDATE promo SET deleted_at = ? WHERE id = ?`;
      db.query(sqlDelete, [timeStamp, id], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong'},
          });
        }
        if (imageToDel) deleteImage(imageToDel, 'promos');
        return resolve({
          status: 200,
          result: {msg: 'Promo deleted.'},
        });
      });
    });
  });
};

module.exports = {
  addPromos,
  deletePromos,
  getListPromo,
  getPromoDetail,
  updatePromo,
};
