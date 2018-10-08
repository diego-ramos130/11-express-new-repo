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

router.put('/api/stores/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `trying to update a store by the id of ${request.params.id}`);
  return Store.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then((newStore) => {
      if (newStore) {
        logger.log(logger.INFO, 'responding with 200 status code and JSON return data');
        return response.json(newStore);
      }
      logger.log(logger.INFO, '404 response, store not found.');
      return next(new HttpError(404, 'Store not found'));
    })
    .catch(next);
});

router.delete('/api/stores/:id', jsonParser, (request, response, next) => {
  return Store.findById(request.params.id)
    .then((foundStore) => {
      if (!foundStore) {
        logger.log(logger.INFO, '404 response, store not found.');
        return next(new HttpError(404, 'store not found'));
      }
      logger.log(logger.INFO, `successfully deleted store by id of ${request.params.id}`);
      return foundStore.remove();
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(error => next(error));
});
