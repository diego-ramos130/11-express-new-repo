'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');
const gameRoutes = require('../routes/game-router');

const app = express();

app.use(cors());

app.use(loggerMiddleware);

app.use(gameRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from catch-all/default route (the route was not found');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      internalServer = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `server is listening on port ${process.env.PORT}`);
      });
    });
};

server.end = () => {
  return mongoose.disconnect()
    .then(() => {
      internalServer.close(() => {
        logger.log(logger.INFO, 'the server is off!');
      });
    });
};
