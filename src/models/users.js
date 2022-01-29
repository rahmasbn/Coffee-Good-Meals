const db = require("../config/db");
const { deleteImage } = require("../helpers/deleteImage");
const bcrypt = require("bcrypt");

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sqlGetUser = `SELECT  id, display_name, first_name, last_name, email, phone, 
    address, gender, dob, image, roles FROM users where id = ?`;
    db.query(sqlGetUser, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: { err: "Something went wrong" },
        });
      }
      if (result.length === 0)
        return resolve({
          status: 404,
          result: { errMsg: "Data cannot be found" },
        });
      return resolve({
        status: 200,
        result: { msg: "Get user data success.", data: result[0] },
      });
    });
  });
};

const updateUser = (body, id) => {
  return new Promise((resolve, reject) => {
    let imageToDel = "";
    const sqlImg = `SELECT image from users WHERE id = ?`;
    db.query(sqlImg, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          result: { err: "Something went wrong." },
        });
      }
      imageToDel = result[0].image;
      const sqlUpdateUser = `UPDATE users set ? WHERE id = ?`;
      db.query(sqlUpdateUser, [body, id], (err) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            result: { err: "Something went wrong." },
          });
        }
        if (body.image) {
          deleteImage(imageToDel, "users");
        }
        return resolve({
          status: 200,
          result: { msg: "Update success.", data: body },
        });
      });
    });
  });
};

const updatePassword = (body, id) => {
  return new Promise((resolve, reject) => {
    const { currentPass, newPass } = body;
    const sqlQuery = `SELECT * FROM users WHERE id = ?`;
    db.query(sqlQuery, [id], async (err, result) => {
      // console.log(result);
      if (err) return reject({ status: 500, err });

      try {
        const hashedPassword = result[0].password;
        // console.log(hashedPassword)
        const checkPassword = await bcrypt.compare(currentPass, hashedPassword);
        // console.log('currentpass: ', currentPass, 'hashPassword: ',hashedPassword)
        // console.log(checkPassword);
        if (!checkPassword) return reject({ status: 401, err });

        const sqlQuery = `UPDATE users SET password = ? WHERE id = ?`;
        bcrypt
          .hash(newPass, 10)
          .then((hashedPassword) => {
            const password = hashedPassword;
            // console.log(password)
            db.query(sqlQuery, [password, id], (err, result) => {
              if (err) return reject({ status: 500, err });
              return resolve({ status: 200, result });
            });
          })
          .catch((err) => {
            reject({ status: 500, err });
          });
      } catch (err) {
        reject({ status: 500, err });
      }
    });
  });
};

module.exports = {
  getUserById,
  updateUser,
  updatePassword,
};
