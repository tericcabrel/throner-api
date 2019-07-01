// Packages
import moment from 'moment';

// Models
import SettingModel from '../models/setting.model';

// Functions
import logger from '../core/logger/app-logger';
import { INTERNAL_ERROR } from '../core/utils/constants';

const controller = {};

controller.init = async () => {
  try {
    const settings = await SettingModel.getAll();

    if (settings.length === 0) {
      const dateNow = moment().toDate();
      const newSetting = new SettingModel({
        stream_url: process.env.APP_STREAM_URL,
        created_at: dateNow,
        updated_at: dateNow,
      });

      await SettingModel.add(newSetting);
    }
  } catch (err) {
    logger.error(err.stack);
  }
};

controller.getAll = async (req, res) => {
  try {
    const settings = await SettingModel.getAll();

    const response = settings.length === 0 ? {} : settings[0];
    return res.json(response);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
