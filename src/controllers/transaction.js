const resHelper = require('../helpers/sendResponse');
const modelTransaction = require('../models/transactions');

const addTransaction = (req, res) => {
  const {body} = req;
  modelTransaction
    .addTransaction(body)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};
const updateTransaction = (req, res) => {
  const {body, params} = req;
  modelTransaction
    .updateTransaction(body, params.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const deleteTransaction = (req, res) => {
  const {body, userInfo} = req;
  modelTransaction
    .deleteTransaction(body.id, userInfo.roles)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const userTransaction = (req, res) => {
  const {query, userInfo} = req;
  modelTransaction
    .userTransaction(query, userInfo)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

module.exports = {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  userTransaction,
};
