const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const token = req.header('x-access-token');

  const jwtOptions = {issuer: process.env.ISSUER};
  jwt.verify(token, process.env.SECRET_KEY, jwtOptions, (err, payload) => {
    if (err)
      return res
        .status(403)
        .json({msg: 'You need to login to perform this action.'});
    const {id, roles} = payload;
    req.userInfo = {id, roles};
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  const {roles} = req.userInfo;
  if (roles === 2) {
    return next();
  }
  res
    .status(403)
    .json({err: 'You need to login as Admin to perform this action.'});
};

module.exports = {
  checkToken,
  authorizeAdmin,
};
