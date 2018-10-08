'use strict';

const mongoose = require('mongoose');


const storeSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'game',
    },
  ],
},
{
  usePushEach: true,
});

module.exports = mongoose.model('store', storeSchema);
