const express = require("express");

const userRouter = express.Router();

const controllerUsers = require("../controllers/users");
const authorize = require("../middlewares/authorize");

userRouter.get("/:id", authorize.checkToken, controllerUsers.getUserById);
userRouter.patch("/:id", authorize.checkToken, controllerUsers.updateUser);

module.exports = userRouter;
