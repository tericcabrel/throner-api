import logger from '../logger/app-logger';
import RabbitConnectionManager from './rabbitConnectionManager';

const logInDev = (msg) => {
  logger.info(`[*] Received data: ${msg.content.toString()}`);
};

const exchanges = {
  takePicture: {
    send: 'SEND_PICTURE_CAPTURE',
    receive: 'RECEIVE_PICTURE_CAPTURE',
  },
};

module.exports = async (conn, io, socket) => {
  const channel = await RabbitConnectionManager.getChannelInstance(conn);

  channel.assertQueue(exchanges.takePicture.receive, { durable: false });
  channel.consume(exchanges.takePicture.receive, (msg) => {
    if (msg !== null) {
      logInDev(msg);
      io.emit('TK_PIC_RESPONSE', msg.content.toString());
    } else {
      logger.info('[*] Problem when receiving data -- msg is empty or null --');
    }
  }, { noAck: true });

  socket.on('TK_PIC_REQUEST', (data) => {
    logger.info(`[SEND_PIC_INFO] ${data}`);
    channel.assertQueue(exchanges.takePicture.send, { durable: false });
    channel.sendToQueue(exchanges.takePicture.send, Buffer.from(data));
  });
};
