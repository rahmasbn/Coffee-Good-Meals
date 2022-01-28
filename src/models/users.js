const db = require('../config/db');

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGetUser = `SELECT  id, display_name, first_name, last_name, email, 
      address, gender, dob, image FROM users where id = ?`;
    db.query(sqlGetUser, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong'},
        });
      }
      if (result.length === 0)
        return resolve({status: 404, result: {errMsg: 'Data cannot be found'}});
      return resolve({
        status: 200,
        result: {msg: 'Get user data success.', data: result[0]},
      });
    });
  });
};

const updateUser = (body, id) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateUser = `UPDATE users set ? WHERE id = ?`;
    db.query(sqlUpdateUser, [body, id], (err) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: {err: 'Something went wrong.'},
        });
      }
      return resolve({
        status: 200,
        result: {msg: 'Update success.', data: body},
      });
    });
  });
};

module.exports = {
  getUserById,
  updateUser,
};
