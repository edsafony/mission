jest.mock('../db', () => {
  const Database = require('better-sqlite3');
  const migrate = require('../db/migrate');
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
});

const db = require('../db');
const request = require('supertest');
const app = require('../index');

beforeEach(() => {
  db.exec('DELETE FROM mission');
});

describe('GET /api/mission', () => {
  test('returns { text: "" } when no mission exists', async () => {
    const res = await request(app).get('/api/mission');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ text: '' });
  });

  test('returns mission text after it has been set', async () => {
    db.prepare('INSERT INTO mission (id, text) VALUES (1, ?)').run('My mission statement');
    const res = await request(app).get('/api/mission');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: 'My mission statement' });
  });
});

describe('PUT /api/mission', () => {
  test('creates mission and returns 200 with text', async () => {
    const res = await request(app).put('/api/mission').send({ text: 'To live with integrity' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: 'To live with integrity' });
  });

  test('updates existing mission text', async () => {
    db.prepare('INSERT INTO mission (id, text) VALUES (1, ?)').run('Old mission');
    const res = await request(app).put('/api/mission').send({ text: 'New mission' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: 'New mission' });
  });

  test('allows setting text to empty string', async () => {
    db.prepare('INSERT INTO mission (id, text) VALUES (1, ?)').run('Old mission');
    const res = await request(app).put('/api/mission').send({ text: '' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: '' });
  });

  test('returns 400 when text field is missing', async () => {
    const res = await request(app).put('/api/mission').send({});
    expect(res.status).toBe(400);
  });
});
