const db = require('../db');
const request = require('supertest');
const app = require('../index');

let weekId, roleId;

beforeEach(async () => {
  await db.query('TRUNCATE goals, weeks, roles RESTART IDENTITY CASCADE');
  const { rows: weekRows } = await db.query('INSERT INTO weeks (start_date) VALUES ($1) RETURNING id', ['2025-05-05']);
  weekId = weekRows[0].id;
  const { rows: roleRows } = await db.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', ['Father']);
  roleId = roleRows[0].id;
});

describe('POST /api/goals', () => {
  test('creates a goal and returns 201', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ week_id: weekId, role_id: roleId, text: 'Read daily' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ week_id: weekId, role_id: roleId, text: 'Read daily' });
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 when text is missing', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ week_id: weekId, role_id: roleId });
    expect(res.status).toBe(400);
  });

  test('returns 400 when week_id is missing', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ role_id: roleId, text: 'Read daily' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when role_id is missing', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ week_id: weekId, text: 'Read daily' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/goals/:id', () => {
  let goalId;

  beforeEach(async () => {
    const { rows } = await db.query(
      'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING id',
      [weekId, roleId, 'Read daily']
    );
    goalId = rows[0].id;
  });

  test('updates goal text and returns the updated goal', async () => {
    const res = await request(app).put(`/api/goals/${goalId}`).send({ text: 'Read every morning' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: goalId, text: 'Read every morning' });
  });

  test('returns 404 for non-existent goal', async () => {
    const res = await request(app).put('/api/goals/9999').send({ text: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/goals/:id', () => {
  let goalId;

  beforeEach(async () => {
    const { rows } = await db.query(
      'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING id',
      [weekId, roleId, 'Read daily']
    );
    goalId = rows[0].id;
  });

  test('deletes the goal and returns { deleted: true }', async () => {
    const res = await request(app).delete(`/api/goals/${goalId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  test('returns 404 for non-existent goal', async () => {
    const res = await request(app).delete('/api/goals/9999');
    expect(res.status).toBe(404);
  });
});
