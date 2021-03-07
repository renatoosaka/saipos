import http from 'http';
import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import { IO } from '../../infra/socket';

const app = express();
const server = http.createServer(app);

IO.connect(server);

setupMiddlewares(app);
setupRoutes(app);

IO.client.on('connection', socket => {
  console.log('connected Socket');
});

export default server;
