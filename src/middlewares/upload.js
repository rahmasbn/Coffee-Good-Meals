const multer = require('multer');
const path = require('path');

const maxfilesize = 2 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('current route path, uplaod', req.originalUrl);
    const folder = req.originalUrl;
    const uploadPath = 'public' + folder;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const {userInfo} = req;
    const id = userInfo.id;
    console.log('fieldname:', file.fieldname);
    const fileName = `${file.fieldname}-${id}-${Date.now()}${path.extname(
      file.originalname,
    )}`;
    cb(null, fileName);
  },
});

const multerOption = {
  storage,
  fileFilter: (req, file, cb) => {
    req.isPassFilter = true;
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!');
      err.code = 'WRONG_EXSTENSION';
      return cb(err);
    }
  },
  limits: {fileSize: maxfilesize},
};

const upload = multer(multerOption).single('image');
const multerHandler = (req, res, next) => {
  upload(req, res, (err) => {
    console.log(req.payload);
    console.log('[inside] inside ulterHandler');
    console.log('current dirname', __dirname);
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          errMsg: `Image size mustn't be bigger than 2MB!`,
          err: err.code,
        });
      }
      if (err.code === 'WRONG_EXSTENSION') {
        return res.status(400).json({
          errMsg: `Only .png, .jpg and .jpeg format allowed!`,
          err: err.code,
        });
      }
      return res.status(500).json({
        errMsg: `Something went wrong.`,
        err,
      });
    }
    console.log('log file:', req.file);
    next();
  });
};

module.exports = multerHandler;
