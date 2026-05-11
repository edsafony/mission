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
  db.exec('DELETE FROM weeks');
});

describe('GET /api/weeks', () => {
  test('returns 200 with empty array when no weeks exist', async () => {
    const res = await request(app).get('/api/weeks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all weeks ordered by start_date', async () => {
    db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run('2025-05-12');
    db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run('2025-05-05');

    const res = await request(app).get('/api/weeks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].start_date).toBe('2025-05-05');
    expect(res.body[1].start_date).toBe('2025-05-12');
  });
});

describe('POST /api/weeks', () => {
  test('creates a week and returns 201', async () => {
    const res = await request(app).post('/api/weeks').send({ start_date: '2025-05-05' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ start_date: '2025-05-05' });
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 when start_date is missing', async () => {
    const res = await request(app).post('/api/weeks').send({});
    expect(res.status).toBe(400);
  });

  test('returns 409 with existing week when start_date already exists', async () => {
    const first = await request(app).post('/api/weeks').send({ start_date: '2025-05-05' });
    const second = await request(app).post('/api/weeks').send({ start_date: '2025-05-05' });
    expect(second.status).toBe(409);
    expect(second.body).toMatchObject({ id: first.body.id, start_date: '2025-05-05' });
  });
});

describe('GET /api/weeks/:id', () => {
  let weekId;

  beforeEach(() => {
    const result = db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run('2025-05-05');
    weekId = result.lastInsertRowid;
  });

  test('returns the week by id', async () => {
    const res = await request(app).get(`/api/weeks/${weekId}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: weekId, start_date: '2025-05-05' });
  });

  test('returns 404 for non-existent week', async () => {
    const res = await request(app).get('/api/weeks/9999');
    expect(res.status).toBe(404);
  });
});
