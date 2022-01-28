const express = require('express');

const categoryRouter = express.Router();
const categoryController = require("../controllers/category");


// /category
categoryRouter.get("/", categoryController.getCategory)


module.exports = categoryRouter;