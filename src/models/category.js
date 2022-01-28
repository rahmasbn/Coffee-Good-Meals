const db = require("../config/db");

const getCategory = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM category";
    db.query(sqlQuery, (err, result) => {
      if (err) return reject({ status: 500, err });
      resolve({ status: 200, result });
    });
  });
};

module.exports = {
  getCategory,
};
