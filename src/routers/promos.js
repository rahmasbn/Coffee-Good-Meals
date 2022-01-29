const express = require('express');
const {authorizeAdmin, checkToken} = require('../middlewares/authorize');
const promosController = require('../controllers/promos');
const upload = require('../middlewares/upload');
const promosRouter = express.Router();

promosRouter.get('/', promosController.getListPromo);
promosRouter.get('/:id', promosController.detailPromos);

promosRouter.post(
  '/',
  checkToken,
  authorizeAdmin,
  upload,
  promosController.addPromos,
);

promosRouter.patch(
  '/',
  checkToken,
  authorizeAdmin,
  upload,
  promosController.updatePromo,
);

promosRouter.delete(
  '/:id',
  checkToken,
  authorizeAdmin,
  promosController.deletePromos,
);
module.exports = promosRouter;
