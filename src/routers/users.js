const express = require('express');

const userRouter = express.Router();

const controllerUsers = require('../controllers/users');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/upload');

userRouter.get('/:id', authorize.checkToken, controllerUsers.getUserById);
userRouter.patch('/', authorize.checkToken, upload, controllerUsers.updateUser);

module.exports = userRouter;
