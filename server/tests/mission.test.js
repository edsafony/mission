const db = require('../db');
const request = require('supertest');
const app = require('../index');

beforeEach(async () => {
  await db.query('TRUNCATE mission RESTART IDENTITY CASCADE');
});

describe('GET /api/mission', () => {
  test('returns { text: "" } when no mission exists', async () => {
    const res = await request(app).get('/api/mission');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ text: '' });
  });

  test('returns mission text after it has been set', async () => {
    await db.query('INSERT INTO mission (id, text) VALUES (1, $1)', ['My mission statement']);
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
    await db.query('INSERT INTO mission (id, text) VALUES (1, $1)', ['Old mission']);
    const res = await request(app).put('/api/mission').send({ text: 'New mission' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: 'New mission' });
  });

  test('allows setting text to empty string', async () => {
    await db.query('INSERT INTO mission (id, text) VALUES (1, $1)', ['Old mission']);
    const res = await request(app).put('/api/mission').send({ text: '' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ text: '' });
  });

  test('returns 400 when text field is missing', async () => {
    const res = await request(app).put('/api/mission').send({});
    expect(res.status).toBe(400);
  });
});
