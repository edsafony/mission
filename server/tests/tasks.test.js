const db = require('../db');
const request = require('supertest');
const app = require('../index');

let goalId;

beforeEach(async () => {
  await db.query('TRUNCATE tasks, goals, weeks, roles RESTART IDENTITY CASCADE');
  const { rows: weekRows } = await db.query('INSERT INTO weeks (start_date) VALUES ($1) RETURNING id', ['2025-05-05']);
  const { rows: roleRows } = await db.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', ['Father']);
  const { rows: goalRows } = await db.query(
    'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING id',
    [weekRows[0].id, roleRows[0].id, 'Read daily']
  );
  goalId = goalRows[0].id;
});

describe('POST /api/tasks', () => {
  test('creates a task and returns 201', async () => {
    const res = await request(app).post('/api/tasks').send({ goal_id: goalId, text: 'Read 20 pages' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ goal_id: goalId, text: 'Read 20 pages', completed: 0 });
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 when text is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ goal_id: goalId });
    expect(res.status).toBe(400);
  });

  test('returns 400 when goal_id is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ text: 'Read 20 pages' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  let taskId;

  beforeEach(async () => {
    const { rows } = await db.query(
      'INSERT INTO tasks (goal_id, text, completed) VALUES ($1, $2, 0) RETURNING id',
      [goalId, 'Read 20 pages']
    );
    taskId = rows[0].id;
  });

  test('updates task text', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({ text: 'Read 30 pages' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: taskId, text: 'Read 30 pages' });
  });

  test('toggles completed to true', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  test('toggles completed back to false', async () => {
    await db.query('UPDATE tasks SET completed = 1 WHERE id = $1', [taskId]);
    const res = await request(app).put(`/api/tasks/${taskId}`).send({ completed: false });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(0);
  });

  test('returns 404 for non-existent task', async () => {
    const res = await request(app).put('/api/tasks/9999').send({ text: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  let taskId;

  beforeEach(async () => {
    const { rows } = await db.query(
      'INSERT INTO tasks (goal_id, text, completed) VALUES ($1, $2, 0) RETURNING id',
      [goalId, 'Read 20 pages']
    );
    taskId = rows[0].id;
  });

  test('deletes the task and returns { deleted: true }', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  test('returns 404 for non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/9999');
    expect(res.status).toBe(404);
  });
});
