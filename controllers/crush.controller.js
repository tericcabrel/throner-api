// Packages
import moment from 'moment';
import ua from 'ua-parser';

// Models
import CrushModel from '../models/crush.model';

// Functions
import logger from '../core/logger/app-logger';
import { DELETE_SUCCESS, INTERNAL_ERROR } from '../core/utils/constants';
import { parseRequest } from '../core/utils/helpers';
import PositionModel from '../models/position.model';

const controller = {};

controller.create = async (req, res) => {
  try {
    const ip = req.connection.remoteAddress;
    const info = ua.parse(req.headers['user-agent']);
    const dateNow = moment().toDate();

    const newCrush = new CrushModel({
      ipAddress: ip,
      data: info.string,
      logged: false,
      created_at: dateNow,
      updated_at: dateNow,
    });

    const savedCrush = await CrushModel.add(newCrush);

    return res.json({ id: savedCrush._id });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.update = async (req, res) => {
  const id = req.params.id;
  const data = parseRequest(req.body, CrushModel.updateParams);
  let updated = null;

  try {
    if (data !== null) {
      await CrushModel.change(id, data);
    }
    updated = await CrushModel.get(id);
    return res.json(updated);
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ error: INTERNAL_ERROR });
  }
};

controller.delete = async (req, res) => {
  try {
    await CrushModel.delete(req.params.id);
    return res.json({ message: `Crush ${DELETE_SUCCESS}` });
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getById = async (req, res) => {
  try {
    const crush = await CrushModel.get(req.params.id);
    const { _id, name, created_at, updated_at } = crush;
    const result = { _id, name, created_at, updated_at };
    result.positions = await PositionModel.getBy({ crush: _id });

    return res.json(result);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.getAll = async (req, res) => {
  try {
    const crushs = await CrushModel.getAll();

    return res.json(crushs);
  } catch (err) {
    logger.error(err.stack);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
