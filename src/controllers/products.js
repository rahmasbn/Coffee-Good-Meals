const resHelper = require('../helpers/sendResponse');
const modelProduct = require('../models/products');

const getProduct = (req, res) => {
  const {params} = req;
  modelProduct
    .getProduct(params.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};
const postProducts = (req, res) => {
  let {body} = req;
  const {file, userInfo} = req;
  if (file) {
    body = {...body, ...{image: req.file.filename}};
  }
  modelProduct
    .addProduct(body, userInfo.id)
    .then(({status, result}) => {
      resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};
const patchProducts = () => {};
const deleteProducts = () => {};

module.exports = {
  getProduct,
  postProducts,
  patchProducts,
  deleteProducts,
};
