const resHelper = require("../helpers/sendResponse");
const modelUser = require("../models/users");

const getUserById = (req, res) => {
  const { id } = req.userInfo;

  modelUser
    .getUserById(id)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      resHelper.error(res, status, err);
    });
};

const updateUser = (req, res) => {
  let { body } = req;
  const { file, userInfo } = req;
  if (file) {
    body = { ...body, ...{ image: req.file.filename } };
    console.log("new body", body);
  }
  modelUser
    .updateUser(body, userInfo.id)
    .then(({ status, result }) => {
      resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      resHelper.error(res, status, err);
    });
};

const updatePassword = (req, res) => {
  const { body } = req;
  const { id } = req.userInfo;

  modelUser
    .updatePassword(body, id)
    .then(({ status }) => {
      resHelper.success(res, status, {
        msg: "Password updated successfully",
        id,
      });
    })
    .catch(({ status, err }) => {
      if (status === 401)
        return resHelper.error(res, status, "Current Password is invalid");
      resHelper.error(res, status, err);
    });
};

const deletePhoto = (req, res) => {
  const {userInfo} = req;
  modelUser
    .deletePhoto(userInfo.id)
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
  updatePassword,
  deletePhoto,
};
