'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Store = require('../model/store');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/stores', jsonParser, (request, response, next) => {
  return new Store(request.body).save()
    .then((savedStore) => {
      logger.log(logger.INFO, 'responding with a 200 status code');
      return response.json(savedStore);
    })
    .catch(next);
});

router.get('/api/stores/:id', jsonParser, (request, response, next) => {
  Store.findById(request.params.id).populate('games')
    .then((query) => {
      logger.log(logger.INFO, 'responding with 200 status code and jSON return data.');
      return response.json(query);
    })
    .catch(() => {
      return next(new HttpError(404, 'store not found'));
    });
});

router.get('/api/stores/', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'responding with 400 status code for incorrect req');
  return next(new HttpError(400, 'incorrect request'));
});
