const resHelper = require('../helpers/sendResponse');
const modelPromos = require('../models/promos');

const addPromos = (req, res) => {
  let {body} = req;
  const {file} = req;
  if (file) {
    body = {...body, ...{image: req.file.filename}};
  }
  modelPromos
    .addPromos(body)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const getListPromo = (req, res) => {
  modelPromos
    .getListPromo()
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const detailPromos = (req, res) => {
  const {params} = req;
  modelPromos
    .getPromoDetail(params.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const updatePromo = (req, res) => {
  let {body} = req;
  const {file} = req;
  if (file) {
    body = {...body, ...{image: file.filename}};
  }
  const id = body.id;
  delete body.id;
  modelPromos
    .updatePromo(body, id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const deletePromos = (req, res) => {
  const {params} = req;
  modelPromos
    .deletePromos(params.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

module.exports = {
  updatePromo,
  getListPromo,
  addPromos,
  detailPromos,
  deletePromos,
};
