const express = require('express');
const transactionRouter = express.Router();
const controllerTransaction = require('../controllers/transaction');
const authorize = require('../middlewares/authorize');

transactionRouter.get(
  '/',
  authorize.checkToken,
  controllerTransaction.userTransaction,
);

// transactionRouter.get(
//   '/statistic',
//   authorize.checkToken,
//   authorize.authorizeAdmin,
//   controllerTransaction.getStatistic,
// );

transactionRouter.post(
  '/',
  authorize.checkToken,
  authorize.authorizeCustomer,
  controllerTransaction.addTransaction,
);

transactionRouter.patch(
  '/:id',
  authorize.checkToken,
  authorize.authorizeAdmin,
  controllerTransaction.updateTransaction,
);

transactionRouter.delete(
  '/',
  authorize.checkToken,
  controllerTransaction.deleteTransaction,
);

module.exports = transactionRouter;
