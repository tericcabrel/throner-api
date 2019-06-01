// Packages
import moment from 'moment';

// Models
import SessionModel from '../models/session.model';
import PositionModel from '../models/position.model';

// Functions
import logger from '../core/logger/app-logger';
import { DELETE_SUCCESS, INTERNAL_ERROR } from '../core/utils/constants';
import { randomStr } from '../core/utils/helpers';

const controller = {};

const getSession = async (sessionId) => {
  try {
    let session = null;
    if (sessionId) {
      session = await SessionModel.get(sessionId);
    }

    if (!session) {
      const sessions = SessionModel.getAll();
      const sessionLength = sessions.length;
      if (sessionLength > 0) {
        return sessions[0];
      }

      const dateNow = moment().toDate();
      const newSession = new SessionModel({
        name: randomStr(),
        created_at: dateNow,
        updated_at: dateNow,
      });

      return await SessionModel.add(newSession);
    }

    return session;
  } catch (err) {
    logger.error(err.stack);
    return null;
  }
};

controller.create = async (req, res) => {
  const { lat, lon, alt, session } = req.body;
  try {
    const currentSession = await getSession(session);

    if (!currentSession) {
      logger.error(`Unable to save position: ${JSON.stringify({ lat, lon, alt })}`);
      return res.status(400).json({ error: INTERNAL_ERROR });
    }

    const dateNow = moment().toDate();
    const { _id } = currentSession;

    const newPosition = new PositionModel({
      lat,
      lon,
      alt,
      session: _id,
      created_at: dateNow,
      updated_at: dateNow,
    });

    const savedPosition = await PositionModel.add(newPosition);

    return res.json(savedPosition);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.delete = async (req, res) => {
  try {
    await PositionModel.delete(req.params.id);
    return res.json({ message: `Position ${DELETE_SUCCESS}` });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getById = async (req, res) => {
  try {
    const position = await PositionModel.get(req.params.id);
    return res.json(position);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getAll = async (req, res) => {
  try {
    const positions = await PositionModel.getAll();

    return res.json(positions);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
