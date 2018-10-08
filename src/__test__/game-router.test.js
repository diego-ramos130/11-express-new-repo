'use strict';

require('dotenv').config();
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const gameMock = require('./lib/mockGame');
const storeMock = require('./lib/mockStore');

const API_URL = `http://localhost:${process.env.PORT}/api/games`;

describe('/api/games', () => {
  beforeAll(server.start);
  afterAll(server.end);
  beforeEach(gameMock.pCleanGameMocks);
  beforeEach(storeMock.pCleanStoreMocks);

  test('should break to 404 in case of $insert_url_that_doesn\'t_exist', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/aaaaaaahhhhhhhhh`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('should give a 200 on a post + json data', () => {
    let store;
    return storeMock.pCreateStoreMock()
      .then((storedStore) => {
        store = storedStore;
        const originalRequest = {
          game: faker.lorem.words(1),
          type: faker.lorem.words(3),
          store: store.id,
        };
        return superagent.post(API_URL)
          .set('Content-Type', 'application/json')
          .send(originalRequest)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.game).toEqual(originalRequest.game);
            expect(response.body.type).toEqual(originalRequest.type);
            expect(response.body.timestamp).toBeTruthy();
          });
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
  test('should give 200 if you actually request something with a correct id', () => {
    return storeMock.pCreateStoreMock()
      .then((storedStore) => {
        return gameMock.pCreateGameMock(storedStore.id)
          .then((game) => {
            return superagent.get(`${API_URL}/${game.id}`)
              .then((getResponse) => {
                expect(getResponse.body._id).toEqual(game.id);
                expect(getResponse.body.game).toEqual(game.game);
                expect(getResponse.body.type).toEqual(game.type);
              });
          });
      })
      .catch((error) => {
        throw error;
      });
  });
  test('should give 400 if you post without a required field', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        game: 'Path of Exile',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('should give 200 if you modify a file that does exist', () => {
    return storeMock.pCreateStoreMock()
      .then((storedStore) => {
        return gameMock.pCreateGameMock(storedStore.id)
          .then((putTarget) => {
            return superagent.put(`${API_URL}/${putTarget.id}`)
              .set('Content-Type', 'application/json')
              .send({
                game: 'Path of Exile',
                type: 'Diablo Clone',
              })
              .then((putResponse) => {
                expect(putResponse.status).toEqual(200);
                expect(putResponse.body._id).toEqual(putTarget.id);
                expect(putResponse.body.game).toEqual('Path of Exile');
                expect(putResponse.body.type).toEqual('Diablo Clone');
              });
          });
      });
  });
  test('should give 200 if you delete a file correct', () => {
    return storeMock.pCreateStoreMock()
      .then((storedStore) => {
        return gameMock.pCreateGameMock(storedStore.id)
          .then((deleteTarget) => {
            return superagent.delete(`${API_URL}/${deleteTarget.id}`)
              .then((deleteResponse) => {
                expect(deleteResponse.status).toEqual(204);
              });
          });
      });
  });
});
