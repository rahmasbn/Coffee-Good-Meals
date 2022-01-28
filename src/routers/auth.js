const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/auth");
const validate = require("../middlewares/validate");

// /auth
authRouter.post("/register", validate.register, authController.register);
authRouter.post("/login", validate.login, authController.login);
authRouter.post("/forgot-password", authController.forgotPassword)
authRouter.post("/checkOTP", authController.checkOTP)
authRouter.post("/reset-password", authController.resetPassword)


module.exports = authRouter;
