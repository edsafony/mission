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

let goalId;

beforeEach(() => {
  db.exec('DELETE FROM tasks');
  db.exec('DELETE FROM goals');
  db.exec('DELETE FROM weeks');
  db.exec('DELETE FROM roles');
  const w = db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run('2025-05-05');
  const r = db.prepare('INSERT INTO roles (name) VALUES (?)').run('Father');
  const g = db.prepare('INSERT INTO goals (week_id, role_id, text) VALUES (?, ?, ?)').run(
    w.lastInsertRowid, r.lastInsertRowid, 'Read daily'
  );
  goalId = g.lastInsertRowid;
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

  beforeEach(() => {
    const t = db.prepare('INSERT INTO tasks (goal_id, text, completed) VALUES (?, ?, 0)').run(goalId, 'Read 20 pages');
    taskId = t.lastInsertRowid;
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
    db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?').run(taskId);
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

  beforeEach(() => {
    const t = db.prepare('INSERT INTO tasks (goal_id, text, completed) VALUES (?, ?, 0)').run(goalId, 'Read 20 pages');
    taskId = t.lastInsertRowid;
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
