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
          result: {err: 'Something went wrong.'},
        });
      }
      if (result.length === 0)
        return resolve({
          status: 404,
          result: {errMsg: 'Data cannot be found.'},
        });
      return resolve({
        status: 200,
        result: {msg: 'Product detail.', data: result[0]},
      });
    });
  });
};

const searchProducts = (query) => {
  return new Promise((resolve, reject) => {
    const {keyword, category, orderBy, sort, page, limit} = query;
    console.log(query);
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
      if (sqlSort) {
        sqlSort = sqlSort.toLocaleLowerCase() === 'desc' ? ' DESC' : ' ASC';
      } else {
        sqlSort = ' ASC';
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
      if (sqlOrderBy === 'popular') {
        sqlOrderBy = '((1-0.5)*count(tp.id_products))';
      }
    } else {
      sqlOrderBy = 'p.created_at';
      sqlSort = ' ASC';
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
    LEFT JOIN transaction_products tp ON tp.id_products = p.id
    WHERE concat(p.name, c.category) LIKE ? AND c.id ? AND deleted_at IS NULL`;
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
      const nPage = nextOffset >= totalData ? null : +sqlPage + 1;
      const pPage = sqlPage > 1 ? +sqlPage - 1 : null;

      const sqlSearch = `SELECT p.id, p.name, p.price, p.image, c.category, p.stock 
      FROM products p JOIN category c ON p.category_id = c.id 
      LEFT JOIN transaction_products tp ON tp.id_products = p.id
      WHERE concat(p.name, c.category) LIKE ? AND c.id ? AND deleted_at IS NULL
      GROUP BY p.id
      ORDER BY ? ?
      LIMIT ? OFFSET ?`;
      db.query(sqlSearch, prepare, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong.'},
          });
        }
        if (nPage == null) {
          nextPage = null;
        } else {
          nextPage += '&page=' + nPage;
        }
        if (pPage == null) {
          previousPage = null;
        } else {
          previousPage += '&page=' + pPage;
        }
        const totalPage =
          totalData < parseInt(sqlLimit)
            ? 1
            : Math.ceil(totalData / parseInt(sqlLimit));
        const meta = {
          totalData,
          totalPage,
          nextPage,
          limit: sqlLimit,
          page: sqlPage,
          previousPage,
        };
        // console.log('search result', result, meta);
        const results = {
          msg: 'Search result',
          meta,
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
    db.query(sqlPost, [body], (err) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      return resolve({
        status: 200,
        result: {msg: 'Add product success.', data: body},
      });
    });
  });
};

const patchProduct = (body, id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = `SELECT image FROM products WHERE id = ?`;
    // console.log('catch 1')
    db.query(sqlGetImage, [id], (err, result) => {
      // console.log('catch 2')
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      // console.log('catch 3')
      const imageToDel = result[0].image;
      // console.log('catch 4')
      if (body.image) {
        // console.log('catch 5')
        console.log('image is not empty', body.image);
        body = {...body, ...{image: body.image}};
      }
      // console.log('catch 6');
      const sqlUpdate = `UPDATE products SET ? WHERE id = ?`;
      db.query(sqlUpdate, [body, id], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong.'},
          });
        }
        if (imageToDel !== null) {
          deleteImage(imageToDel, 'products');
        }
        return resolve({
          status: 200,
          result: {msg: 'Update Success', data: body},
        });
      });
    });
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = 'SELECT image FROM products WHERE id = ?';
    db.query(sqlGetImage, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      const imageToDel = result[0].image;
      console.log('img to del', imageToDel);
      const dateStamp = getTimeStamp();
      const sqlDelete = `UPDATE products SET deleted_at = ? WHERE id = ?`;
      console.log('delete product', dateStamp, id);
      db.query(sqlDelete, [dateStamp, id], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: {err: 'Something went wrong.'},
          });
        }
        deleteImage(imageToDel, 'products');
        return resolve({
          status: 200,
          result: {msg: 'Product deleted.', id},
        });
      });
    });
  });
};

module.exports = {
  getProduct,
  searchProducts,
  addProduct,
  patchProduct,
  deleteProduct,
};
