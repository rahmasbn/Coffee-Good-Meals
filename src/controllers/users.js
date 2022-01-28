const resHelper = require('../helpers/sendResponse');
const modelUser = require('../models/users');

const getUserById = (req, res) => {
  const {params} = req;
  const id = params.id;
  modelUser
    .getUserById(id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const updateUser = (req, res) => {
  let {body} = req;
  const {file, userInfo} = req;
  if (file) {
    body = {...body, ...{image: req.file.filename}};
    console.log('new body', body);
  }
  modelUser
    .updateUser(body, userInfo.id)
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
