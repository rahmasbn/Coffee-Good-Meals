const express = require('express');
const mainRouter = express.Router();

const authRouter = require('./auth');
const categoryRouter = require('./category');
const productsRouter = require('./products');
const promosRouter = require('./promos');
const transactionRouter = require('./transactions');
const userRouter = require('./users');

mainRouter.use('/auth', authRouter);
mainRouter.use('/category', categoryRouter);
mainRouter.use('/products', productsRouter);
mainRouter.use('/promos', promosRouter);
mainRouter.use('/transaction', transactionRouter);
mainRouter.use('/users', userRouter);

module.exports = mainRouter;
