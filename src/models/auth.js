const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = (body, email) => {
  return new Promise((resolve, reject) => {
    const registerEmail = `SELECT email FROM users WHERE email = ?`;
    db.query(registerEmail, [email], (err, result) => {
      if (err) return reject({ status: 500, err });
      if (result.length >= 1)
        return reject({ status: 400, err: "Duplicated Email" });

      const sqlQuery = "INSERT INTO users SET ?";
      bcrypt
        .hash(body.password, 10)
        .then((hashedPassword) => {
          const newBody = {
            ...body,
            roles: 1,
            password: hashedPassword,
          };
          db.query(sqlQuery, [newBody], (err, result) => {
            if (err) return reject({ status: 500, err });
            resolve({ status: 201, result });
          });
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  });
};

const login = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    const sqlQuery = "SELECT * FROM users WHERE ?";

    db.query(sqlQuery, [{ email }], async (err, result) => {
      if (err) return reject({ status: 500, err });
      // untuk cek apakah emailnya ada di db
      if (result.length == 0)
        return reject({ status: 401, err: "Invalid Email/Password" });

      try {
        const hashedPassword = result[0].password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        // console.log(checkPassword);

        // untuk cek apakah password yang diinput sama dgn di db
        if (checkPassword) {
          const payload = {
            id: result[0].id,
            roles: result[0].roles,
          };
          const jwtOptions = {
            expiresIn: "1h",
            issuer: process.env.ISSUER,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            jwtOptions,
            (err, token) => {
              if (err) return reject({ status: 500, err });
              const data = {
                token,
                image: result[0].image,
                roles: payload.roles,
              };
              resolve({ status: 200, result: data });
            }
          );
        } else {
          reject({ status: 401, err: "Invalid Email/Password" });
        }
      } catch (err) {
        reject({ status: 500, err });
      }
    });
  });
};

module.exports = { register, login };
