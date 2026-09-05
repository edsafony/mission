const db = require('../db');
const request = require('supertest');
const app = require('../index');

beforeEach(async () => {
  await db.query('TRUNCATE weeks, roles RESTART IDENTITY CASCADE');
});

describe('GET /api/weeks', () => {
  test('returns 200 with empty array when no weeks exist', async () => {
    const res = await request(app).get('/api/weeks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all weeks ordered by start_date', async () => {
    await db.query('INSERT INTO weeks (start_date) VALUES ($1)', ['2025-05-12']);
    await db.query('INSERT INTO weeks (start_date) VALUES ($1)', ['2025-05-05']);

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
  let weekId, roleId;

  beforeEach(async () => {
    const { rows: weekRows } = await db.query('INSERT INTO weeks (start_date) VALUES ($1) RETURNING id', ['2025-05-05']);
    weekId = weekRows[0].id;
    const { rows: roleRows } = await db.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', ['Father']);
    roleId = roleRows[0].id;
  });

  test('returns the week by id with empty goals array', async () => {
    const res = await request(app).get(`/api/weeks/${weekId}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: weekId, start_date: '2025-05-05' });
    expect(res.body.goals).toEqual([]);
  });

  test('returns nested goals with role_name and tasks', async () => {
    const { rows: goalRows } = await db.query(
      'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING id',
      [weekId, roleId, 'Read daily']
    );
    await db.query('INSERT INTO tasks (goal_id, text) VALUES ($1, $2)', [goalRows[0].id, 'Read 20 pages']);

    const res = await request(app).get(`/api/weeks/${weekId}`);
    expect(res.status).toBe(200);
    expect(res.body.goals).toHaveLength(1);
    expect(res.body.goals[0]).toMatchObject({ text: 'Read daily', role_name: 'Father' });
    expect(res.body.goals[0].tasks).toHaveLength(1);
    expect(res.body.goals[0].tasks[0]).toMatchObject({ text: 'Read 20 pages', completed: 0 });
  });

  test('returns 404 for non-existent week', async () => {
    const res = await request(app).get('/api/weeks/9999');
    expect(res.status).toBe(404);
  });
});
