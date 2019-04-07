require('dotenv').config();

import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import expressValidator from 'express-validator';
// import socketIO from 'socket.io';

// Utilities
import logger from './core/logger/app-logger';
import dbConnection from './core/db/connect';
import verifyLangMiddleware from './core/middleware/verifyLang';

// Routes
import defaultRoute from './routes/default.route';
import pictureRoute from './routes/picture.route';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';


const port = process.env.SERVER_PORT;

dbConnection();

const app = express();

const server = http.createServer(app);
// const io = socketIO(server);
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev', { stream: logger.stream }));
app.use(expressValidator());

app.use(verifyLangMiddleware);

defaultRoute(router);
pictureRoute(router);
userRoute(router);
authRoute(router);

app.use(router);

server.listen(port, () => {
  logger.info(`Server started - ${port}`, 1);
});
