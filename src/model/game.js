'use strict';

const mongoose = require('mongoose');


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
});

module.exports = mongoose.model('game', gameSchema);
