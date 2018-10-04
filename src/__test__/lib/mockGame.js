'use strict';

const faker = require('faker');
const Game = require('../../model/game');

const gameMock = module.exports = {};

gameMock.pCreateGameMock = () => {
  return new Game({
    game: faker.lorem.words(10),
    type: faker.lorem.words(10),
  }).save();
};

gameMock.pCleanGameMocks = () => {
  return Game.remove({});
};
