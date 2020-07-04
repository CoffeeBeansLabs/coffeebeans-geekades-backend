import http from 'http';
import socket from 'socket.io';
import chalk from 'chalk';

import sequelize from '~/core/sequelize';

import { PORT, HOST } from './env';
import app from './app';

const server = http.Server(app);
const io = socket(server);

app.set('socket', io);
io.origins(['*:*']);

server.listen(Number(PORT), HOST, () => {
  console.log(chalk.hex('#009688')('🚀 App: Bootstrap Succeeded.'));
  console.log(chalk.hex('#009688')(`🚀 Host: http://${HOST}:${PORT}/.`));

  sequelize
    .authenticate()
    .then(() => console.log(chalk.hex('#009688')('🚀 Postgres: Connection Succeeded.')))
    .catch(err => console.error(err));
});

io.on('connection', connSocket => {
  console.log(chalk.hex('#009688')('🚀 Socket: Connection Succeeded.'));
  connSocket.on('disconnect', () => console.log(chalk.hex('#009688')('🚀 Socket: Disconnected.')));
});

export default server;
