// Packages
import moment from 'moment';

// Models
import SessionModel from '../models/session.model';

// Functions
import logger from '../core/logger/app-logger';
import { DELETE_SUCCESS, INTERNAL_ERROR } from '../core/utils/constants';
import { randomStr } from '../core/utils/helpers';

const controller = {};

controller.create = async (req, res) => {
  try {
    const dateNow = moment().toDate();
    const newSession = new SessionModel({
      name: randomStr(),
      created_at: dateNow,
      updated_at: dateNow,
    });

    const savedSession = await SessionModel.add(newSession);

    return res.json(savedSession);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.delete = async (req, res) => {
  try {
    await SessionModel.delete(req.params.id);
    return res.json({ message: `Session ${DELETE_SUCCESS}` });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getById = async (req, res) => {
  try {
    const session = await SessionModel.get(req.params.id);
    return res.json(session);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getAll = async (req, res) => {
  try {
    const sessions = await SessionModel.getAll();

    return res.json(sessions);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
