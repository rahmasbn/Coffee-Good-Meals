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
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const updateUser = (req, res) => {
  const {body, params} = req;
  modelUser
    .updateUser(body, params.id)
    .then(({status, result}) => {
      resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

module.exports = {
  getUserById,
  updateUser,
};
