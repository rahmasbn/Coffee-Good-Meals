const {reject} = require('bcrypt/promises');
const db = require('../config/db');
const {deleteImage} = require('../helpers/deleteImage');

const getProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGet = `SELECT * from products WHERE id = ? and deleted_at IS NULL`;
    db.query(sqlGet, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      if (result.length === 0)
        return resolve({
          status: 404,
          result: {errMsg: 'Data cannot be found.'},
        });
      return resolve({
        status: 200,
        result: {msg: 'Get product detai.', data: result[0]},
      });
    });
  });
};

const searchProducts = (query) => {
  return new Promise((resolve, reject) => {});
};

const addProduct = (body, id) => {
  return new Promise((resolve, reject) => {
    if (body.image) {
      console.log('image is not empty', body.image);
      body = {...body, ...{image: body.image}};
    }
    body = {...body, ...{user_id: id}};
    const sqlPost = `INSERT INTO products SET ?`;
    db.query(sqlPost, [body], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      if (result.length === 0)
        return resolve({
          status: 404,
          result: {errMsg: 'Data cannot be found.'},
        });
      return resolve({
        status: 200,
        result: {msg: 'Add product success.', data: body},
      });
    });
  });
};

module.exports = {
  getProduct,
  searchProducts,
  addProduct,
};
