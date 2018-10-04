'use strict';

const logger = require('./logger');

module.exports = (error, request, response, next) => { //eslint-disable-line
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE');
  logger.log(logger.ERROR, error);
  if (error.status) {
    logger.log(logger.ERROR, `responding with a ${error.status} code and a message of ${error.message}`);
    return response.sendStatus(error.status);
  }
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  return response.sendStatus(500);
};
