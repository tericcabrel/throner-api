
import uuid from 'uuid/v4';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import config from '../core/config/jwt';

import User from '../models/user.model';
import logger from '../core/logger/app-logger';
import userTransformer from '../core/transformers/user';
import { parseRequest } from '../core/utils/helpers';
import userCollectionTransformer from '../core/transformers/usercollection';
import { DELETE_SUCCESS, INTERNAL_ERROR, RESOURCE_NOT_FOUND } from '../core/utils/constants';

const controller = {};

controller.index = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(userCollectionTransformer(users));
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.store = async (req, res) => { 
  try {
    const { name, username, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, 8);
    const userId = uuid();
    const emailToken = bcrypt.hashSync(email, 8);
    const user = new User({
      user_id: userId, name, username, email, password, email_token: emailToken,
    });
    const savedUser = await User.add(user);
    // create a token
    const token = jwt.sign({ id: user.user_id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    return res.status(201).json({ auth: true, user_id: savedUser.user_id, token });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ error: INTERNAL_ERROR });
  }
};

controller.show = async (req, res) => {
  try {
    const user = await User.get(req.params.id);
    if (!user) {
      return res.status(404).json({ message: RESOURCE_NOT_FOUND });
    }
    return res.json(userTransformer(user));
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

controller.update = async (req, res) => {
  const id = req.params.id;
  const user = parseRequest(req.body, User.updateParams);
  let updatedUser = null;

  try {
    if (user !== null) {
      await User.change(id, user);
    }
    updatedUser = await User.get(id);
    return res.json(userTransformer(updatedUser));
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ error: INTERNAL_ERROR });
  }
};

controller.destroy = async (req, res) => {
  const id = req.params.id;

  try {
    await User.delete(id);
    return res.json({ message: DELETE_SUCCESS });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: INTERNAL_ERROR });
  }
};

export default controller;
