// Packages
import moment from 'moment';

// Models
import PictureModel from '../models/picture.model';

// Functions
import logger from '../core/logger/app-logger';
import { DELETE_SUCCESS, INTERNAL_ERROR } from '../core/utils/constants';
import { getBaseUrlFromRequest } from '../core/utils/helpers';

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

controller.delete = async (req, res) => {
  try {
    await PictureModel.delete(req.params.id);
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

export default controller;
