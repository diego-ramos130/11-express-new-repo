'use strict';

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const Store = require('./store');

const gameSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  game: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'store',
  },
});

function gamePreHook(done) {
  return Store.findById(this.store)
    .then((storeFound) => {
      if (!storeFound) {
        throw new HttpError(404, 'store not found');
      }
      storeFound.games.push(this._id);
      return storeFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
}

function gamePostHook(document, done) {
  return Store.findById(document.store)
    .then((storeFound) => {
      if (!storeFound) {
        throw new HttpError(500, 'game not found');
      }
      storeFound.games = storeFound.games.filter((game) => {
        return game._id.toString !== document._id.toString();
      });
      return storeFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
}
gameSchema.post('remove', gamePostHook);
gameSchema.pre('save', gamePreHook);

module.exports = mongoose.model('game', gameSchema);
