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
});
