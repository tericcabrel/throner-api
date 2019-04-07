import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

import { regexIpAddress } from './constants';

const uploadHandler = require('./uploadHandler');

export const parseRequest = (requestBody, objectKeys) => {
  const result = {};

  objectKeys.forEach((key) => {
    if (requestBody[key]) {
      result[key] = requestBody[key];
    }
  });

  const inputKeys = Object.keys(result);

  return inputKeys.length === 0 ? null : result;
};

export const hashPassword = async (password) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const createJSONFile = (data, filePrefix) => {
  const dirPath = path.join(__dirname, '../../public');
  const dataStr = JSON.stringify({ data });
  const filename = `${filePrefix}_${moment().format('YYYY-MM-DD_hh:mm:ss')}.json`;
  const filepath = `${dirPath}/${filename}`;
  fs.writeFileSync(filepath, dataStr);
  
  return { path: filepath, name: filename };
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const uploadFile = async (req, res) => {
  const promise = new Promise((resolve, reject) => {
    uploadHandler(req, res, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve(req.file);
    });
  });
  
  return await promise;
};

export const existMessage = (modelName) => {
  return `The ${modelName} already exist !`;
};

const isValidIPV4Address = (ipAddress) => {
  return regexIpAddress.test(ipAddress);
};

export const getBaseUrlFromRequest = (req) => {
  const port = isValidIPV4Address(req.hostname) || req.hostname === 'localhost' ? `:${process.env.SERVER_PORT}` : '';
  return `${req.protocol}://${req.hostname}${port}`;
};
