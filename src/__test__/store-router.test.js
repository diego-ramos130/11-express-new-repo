'use strict';

require('dotenv').config();
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const gameMock = require('./lib/mockGame');
const storeMock = require('./lib/mockStore');

const API_URL = `http://localhost:${process.env.PORT}/api/stores`;

describe('/api/stores', () => {
  beforeAll(server.start);
  afterAll(server.end);
  beforeEach(gameMock.pCleanGameMocks);
  beforeEach(storeMock.pCleanStoreMocks);

  test('should give 200 on post + json data of the saved store', () => {
    const ogRequest = {
      type: faker.lorem.words(3),
    };
    return superagent.post(`${API_URL}`)
      .set('Content-Type', 'application/json')
      .send(ogRequest)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.type).toEqual(ogRequest.type);
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('should give a 404 on a get that don\'t exist', () => {
    return superagent.get(`${API_URL}/LUUUUUUUUUUUL`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('should give a 400 on passing a get with nothing in the object', () => {
    return superagent.get(`${API_URL}/`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('should give 200 if you actually request a store with a correct id', () => {
    return storeMock.pCreateStoreMock()
      .then((getTarget) => {
        return superagent.get(`${API_URL}/${getTarget.id}`)
          .then((getResponse) => {
            expect(getResponse.body._id).toEqual(getTarget.id);
            expect(getResponse.body.type).toEqual(getTarget.type);
          });
      })
      .catch((error) => {
        throw error;
      });
  });
  test('should give a 200 if you request to update a store with a correct id', () => {
    return storeMock.pCreateStoreMock()
      .then((putTarget) => {
        return superagent.put(`${API_URL}/${putTarget.id}`)
          .set('Content-Type', 'application/json')
          .send({
            type: 'Chris Wilsons Realistic Depiction of New Zealand',
          })
          .then((putResponse) => {
            expect(putResponse.status).toEqual(200);
            expect(putResponse.body._id).toEqual(putTarget.id);
            expect(putResponse.body.type).toEqual('Chris Wilsons Realistic Depiction of New Zealand');
          });
      });
  });
  test('should give a 400 if you tried to update some store that didn\'t exist', () => {
    return superagent.put(`${API_URL}/ahhhh`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('should give 204 if you delete a store that exists', () => {
    return storeMock.pCreateStoreMock()
      .then((storedStore) => {
        return superagent.delete(`${API_URL}/${storedStore.id}`)
          .then((deleteResponse) => {
            expect(deleteResponse.status).toEqual(204);
          });
      });
  });
  test('should give you a 400 if you try to delete a store that doesn\'t exist', () => {
    return superagent.delete(`${API_URL}/kjahsdfklhjsdfh`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('tests for why not: we can make a store with games in it.', () => {
    return storeMock.pCreateStoreMock()
      .then((store) => {
        return gameMock.pCreateGameMock(store.id)
          .then((getTarget) => {
            return superagent.get(`http://localhost:${process.env.PORT}/api/games/${getTarget.id}`)
              .then((getResponse) => {
                expect(getResponse.status).toEqual(200);
                expect(getResponse.body.game).toEqual(getTarget.game);
                expect(getResponse.body.type).toEqual(getTarget.type);
                expect(getResponse.body.store).toEqual(getTarget.store.toString());
              });
          });
      });
  });
});
