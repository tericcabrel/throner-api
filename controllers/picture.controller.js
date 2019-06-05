// Packages
import moment from 'moment';
import * as path from 'path';

// Models
import PictureModel, { cleanCollection } from '../models/picture.model';

// Functions
import logger from '../core/logger/app-logger';
import { PICTURE_UPLOAD_PATH, DELETE_SUCCESS, INTERNAL_ERROR } from '../core/utils/constants';
import { getBaseUrlFromRequest, deleteFile } from '../core/utils/helpers';

const uploadPictureHandler = require('../core/utils/uploadPictureHandler');

const deleteUploadedFile = (uploadedFile) => {
  if (uploadedFile !== null && uploadedFile !== undefined) {
    const fullPath = path.join(__dirname, `.${uploadedFile.destination}/${uploadedFile.filename}`);
    deleteFile(fullPath);
  }
};

const uploadFile = async (req, res) => {
  const promise = new Promise((resolve, reject) => {
    uploadPictureHandler(req, res, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve({ file: req.file, body: req.body });
    });
  });

  return await promise;
};

const controller = {};

controller.create = async (req, res) => {
  const { pictures } = req.body;

  try {
    const length = pictures.length;
    for (let i = 0; i < length; i += 1) {
      const exist = await PictureModel.getOneBy({ name: pictures[i] });
      if (exist) {
        continue;
      }

      const dateNow = moment().toDate();
      const newPicture = new PictureModel({
        name: pictures[i],
        created_at: dateNow,
        updated_at: dateNow,
      });

      await PictureModel.add(newPicture);
    }

    return res.json({ message: 'Completed successfully! ' });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.upload = async (req, res) => {
  let uploadedFile = null;

  try {
    const { file, body } = await uploadFile(req, res);

    uploadedFile = file;

    const dateNow = moment().toDate();
    const newPicture = new PictureModel({
      name: uploadedFile.filename,
      originalname: uploadedFile.originalname,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
      created_at: dateNow,
      updated_at: dateNow,
    });

    await PictureModel.add(newPicture);
    return res.json({ message: 'Picture uploaded successfully!' });
  } catch (err) {
    logger.error(err.stack);
    deleteUploadedFile(uploadedFile);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};

controller.delete = async (req, res) => {
  try {
    const picture = await PictureModel.get(req.params.id);

    if (picture) {
      const fullPath = path.join(__dirname, `.${PICTURE_UPLOAD_PATH}/${picture.name}`);
      deleteFile(fullPath);

      await PictureModel.delete(req.params.id);
    }

    return res.json({ message: `Picture ${DELETE_SUCCESS}` });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getById = async (req, res) => {
  try {
    const picture = await PictureModel.get(req.params.id);
    return res.json(picture);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getAll = async (req, res) => {
  try {
    const pictures = await PictureModel.getAll();
    const appUrl = getBaseUrlFromRequest(req);
    const result = pictures.map(item => PictureModel.toJSON(appUrl, item));

    return res.json(result);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.deleteAll = async (req, res) => {
  try {
    const pictures = await PictureModel.getAll();
    pictures.forEach((picture) => {
      const fullPath = path.join(__dirname, `.${PICTURE_UPLOAD_PATH}/${picture.name}`);
      deleteFile(fullPath);
    });
    await cleanCollection();
    return res.json({ message: `Picture ${DELETE_SUCCESS}` });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
