const db = require('../config/db');
const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');
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
  return new Promise((resolve, reject) => {
    const {keyword, category, orderBy, sort, page, limit} = query;
    let nextPage = '?';
    let previousPage = '?';
    let offset = '';

    nextPage += keyword == '' || !keyword ? `keyword=&` : `keyword=${keyword}&`;
    previousPage +=
      keyword == '' || !keyword ? `keyword=&` : `keyword=${keyword}&`;
    const sqlKeyword = keyword == '' || !keyword ? '%%' : `%${keyword}%`;

    let sqlOrderBy = orderBy;
    let sqlSort = sort;
    let sqlLimit = limit;
    let sqlPage = page;

    if (sqlOrderBy !== '' && typeof sqlOrderBy !== 'undefined') {
      if (typeof sqlSort !== 'undefined') {
        sqlSort = sqlSort.toLocaleLowerCase() === 'desc' ? ' DESC' : ' ASC';
      } else {
        sqlSort = ' ASC';
      }
      if (sqlOrderBy === 'price') {
        sqlOrderBy = 'p.price';
      }
      if (sqlOrderBy === 'price') {
        sqlOrderBy = 'p.price';
      }
      if (sqlOrderBy === 'name') {
        sqlOrderBy === 'p.name';
      }
      if (sqlOrderBy === 'date') {
        sqlOrderBy = 'p.created_at';
      }
    } else {
      sqlOrderBy = 'p.created_at';
    }
    if (!sqlLimit) {
      sqlLimit = '12';
    }
    if (!sqlPage) {
      sqlPage = '1';
      offset = 0;
    } else {
      offset = (+sqlPage - 1) * +sqlLimit;
    }

    nextPage += category == '' || !category ? `` : `categoryId=${category}&`;
    previousPage +=
      category == '' || !category ? `` : `categoryId=${category}&`;
    const sqlCategory =
      category == '' || !category ? 'IS NOT NULL' : ` = ${category}`;

    // prepare;
    const prepare = [
      sqlKeyword,
      mysql.raw(sqlCategory),
      mysql.raw(sqlOrderBy),
      mysql.raw(sqlSort),
      mysql.raw(sqlLimit),
      offset,
    ];
    const sqlCount = `SELECT count(*) count 
      FROM products p JOIN category c ON p.category_id = c.id 
      WHERE concat(p.name, c.category) LIKE ? AND c.id ? AND deleted_at IS NULL`;
    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      const totalData = result[0].count;

      const sqlSearch = `SELECT p.id, p.name, p.price, p.image, c.category, p.stock 
        FROM products p JOIN category c ON p.category_id = c.id 
        WHERE concat(p.name, c.category) LIKE ? AND c.id ? AND deleted_at IS NULL
        ORDER BY ? ?
        LIMIT ? OFFSET ?`;
      db.query(sqlSearch, prepare, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong'},
          });
        }
        console.log('search result', result);
        //add prev and next checker
        const meta = {
          totalData,
          nextPage,
          page: sqlPage,
          previousPage,
        };
        const results = {
          ...meta,
          msg: 'Search result',
          data: result,
        };
        return resolve({status: 200, result: results});
      });
    });
  });
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

const deleteProduct = (id, user_id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = 'SELECT image FROM products WHERE id = ?';
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
      const dateStamp = getTimeStamp();
      const sqlDelete = `UPDATE products SET deleted_at = ? WHERE user_id = ? AND id = ?`;
      db.query(sqlDelete, [dateStamp, user_id, id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong'},
          });
        }
        deleteImage(imageToDel, 'products');
        return resolve({
          status: 200,
          result: {msg: 'Product deleted.'},
        });
      });
    });
  });
};

module.exports = {
  getProduct,
  searchProducts,
  addProduct,
  deleteProduct,
};
