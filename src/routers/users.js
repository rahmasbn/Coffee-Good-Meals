const express = require('express');
const userRouter = express.Router();
const controllerUsers = require('../controllers/users');

userRouter.get('/:id', controllerUsers.getUserById);
userRouter.patch('/:id', controllerUsers.updateUser);

module.exports = userRouter;
