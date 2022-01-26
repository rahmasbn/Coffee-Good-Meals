const authModel = require("../models/auth");
const responseHelper = require("../helpers/sendResponse");

const register = (req, res) => {
  const { body } = req;
  const email = body.email;

  authModel
    .register(body, email)
    .then(({ status, result }) => {
      const objResponse = {
        id: result.insertId,
        email: body.email,
      };
      responseHelper.success(res, status, {
        msg: "Registration Successful",
        objResponse,
      });
    })
    .catch(({ status, err }) => {
      console.log(err);
      if (status == 400) return responseHelper.error(res, status, err);
      responseHelper.error(res, status, err);
    });
};

const login = (req, res) => {
    const { body } = req;
  
    authModel
      .login(body)
      .then(({ status, result }) => {
        responseHelper.success(res, status, {
            msg: "Login Successful",
            result,
        });
      })
      .catch(({ status, err }) => {
        responseHelper.error(res, status, err);
      });
  };


module.exports = { register, login };