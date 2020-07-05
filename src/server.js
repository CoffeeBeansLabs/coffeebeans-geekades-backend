import http from 'http';
import socket from 'socket.io';
import chalk from 'chalk';

import pool from './core/pool';
import { registerFunction, unRegisterFunction } from './messages/real-time';

import { PORT, HOST } from './env';
import app from './app';
import { data, getState } from './core/config';
import { startTimer } from './shared/timer';

const server = http.Server(app);
const io = socket(server, {
  transports: ['polling'],
  path: "/v1/socket.io",
});

app.set('socket', io);
io.origins(['*:*']);

server.listen(Number(PORT), HOST, () => {
  console.log(chalk.hex('#009688')('🚀 App: Bootstrap Succeeded.'));
  console.log(chalk.hex('#009688')(`🚀 Host: http://${HOST}:${PORT}/.`));

  pool
    .connect()
    .then(poolClient => {
      app.set('poolClient', poolClient);
      console.log(chalk.hex('#009688')('🚀 Postgres: Connection Succeeded.'));
    })
    .catch(err => console.error(err));
});

io.on('connection', connSocket => {
  console.log(chalk.hex('#009688')('🚀 Socket: Connection Succeeded.'));
  connSocket.on('disconnect', () => console.log(chalk.hex('#009688')('🚀 Socket: Disconnected.')));
  connSocket.on('ping', (callback) => callback('pong'));
  
  const poolClient = app.get('poolClient');

  registerFunction(connSocket, poolClient);
  unRegisterFunction(connSocket, poolClient);

  if (getState() === 0) {
    startTimer(connSocket, poolClient, new Date(data.config.start_time) - Date.now());
  }
});

export default server;
