const express = require('express');

const productsRouter = express.Router();
const controllerProducts = require('../controllers/products');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/upload');

productsRouter.get('/search', controllerProducts.searchProducts);
productsRouter.get('/:id', controllerProducts.getProduct);

productsRouter.post(
  '/',
  authorize.checkToken, authorize.authorizeAdmin,
  upload,
  controllerProducts.postProducts,
);
productsRouter.patch(
  '/',
  authorize.checkToken, authorize.authorizeAdmin,
  upload,
  controllerProducts.patchProducts,
);
productsRouter.delete(
  '/',
  authorize.checkToken, authorize.authorizeAdmin,
  controllerProducts.deleteProducts,
);

module.exports = productsRouter;
