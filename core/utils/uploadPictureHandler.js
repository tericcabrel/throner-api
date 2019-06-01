import * as path from 'path';
import { PICTURE_UPLOAD_PATH } from '../utils/constants';

const multer = require('multer');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: PICTURE_UPLOAD_PATH,
  filename(req, file, fn) {
    fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

// init

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    validateFile(file, callback);
  },
}).single('picture');

const validateFile = function (file, cb) {
  const extension = ['.jpg', '.jpeg', '.png'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
  const mimeType = ['image/jpg', 'image/jpeg', 'image/png'].indexOf(file.mimetype.toLowerCase()) >= 0;

  if (extension && mimeType) {
    return cb(null, true);
  }
  return cb({ code: 1, message: 'The file is not valid!' });
};

module.exports = upload;
