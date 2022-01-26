const resHelper = require('../helpers/sendResponse');
const modelUser = require('../models/users');

const getUserById = (req, res) => {
  const {params} = req;
  const id = params.id;
  modelUser
    .getUserById(id)
    .then(({status, result}) => {
      resHelper.success(res, status, result);
    })
    .catch(({status, result}) => {
      resHelper.error(res, status, result);
    });
};

const updateUser = (req, res) => {
  const {body, params} = req;
  modelUser
    .updateUser(body, params.id)
    .then(({status, result}) => {
      resHelper.success(res, status, result);
    })
    .catch(({status, result}) => {
      resHelper.error(res, status, result);
    });
};

module.exports = {
  getUserById,
  updateUser,
};
