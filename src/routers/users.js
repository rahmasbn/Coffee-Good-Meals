const express = require("express");

const userRouter = express.Router();

const controllerUsers = require("../controllers/users");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

userRouter.get("/", authorize.checkToken, controllerUsers.getUserById);
userRouter.patch("/", authorize.checkToken, upload, controllerUsers.updateUser);
userRouter.patch("/edit-password", authorize.checkToken, controllerUsers.updatePassword);

module.exports = userRouter;
