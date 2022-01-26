const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/auth");
const validate = require("../middlewares/validate");

// /auth
// register
authRouter.post("/register", validate.register, authController.register);

// login
authRouter.post("/login", validate.login, authController.login);


module.exports = authRouter;
