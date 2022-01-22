const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('GET /api/v1/emojis', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1/emojis')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, ['😀', '😳', '🙄'], done);
  });
});

// Custom tests

describe('GET /api/v1/task/random', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1/task/random')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('responds with a json message that has a key "message"', (done) => {
    request(app)
      .get('/api/v1/task/random')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect((res) => {
        if (!('message' in res.body)) throw new Error("missing message key");
      });
  });

  it('response starts with a valid word', (done) => {
    request(app)
      .get('/api/v1/task/random')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .expect((res) => {
        let words = ["Buy", "Meet", "Call", "Send", "Pick up"];
        let num = 0;
        for (let i in words) {
          if (res.body.message.startsWith(words[i])) num++;
        }
        if (num != 1) throw new Error("response is not valid");
      });
  });
});
