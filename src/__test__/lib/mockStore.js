const faker = require('faker');
const Store = require('../../model/store');

const storeMock = module.exports = {};

storeMock.pCreateStoreMock = () => {
  return new Store({
    game: faker.lorem.words(10),
    type: faker.lorem.words(10),
  }).save();
};

storeMock.pCleanStoreMocks = () => {
  return Store.remove({});
};
