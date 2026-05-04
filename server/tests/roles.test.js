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
  db.exec('DELETE FROM roles');
});

describe('GET /api/roles', () => {
  test('returns 200 with empty array when no roles exist', async () => {
    const res = await request(app).get('/api/roles');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all roles ordered by id', async () => {
    db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)').run('Father', 'Family');
    db.prepare('INSERT INTO roles (name) VALUES (?)').run('Professional');

    const res = await request(app).get('/api/roles');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ name: 'Father', description: 'Family' });
    expect(res.body[1]).toMatchObject({ name: 'Professional', description: null });
  });
});

describe('POST /api/roles', () => {
  test('creates a role with name only and returns 201', async () => {
    const res = await request(app).post('/api/roles').send({ name: 'Father' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Father', description: null });
    expect(res.body.id).toBeDefined();
  });

  test('creates a role with name and description', async () => {
    const res = await request(app)
      .post('/api/roles')
      .send({ name: 'Father', description: 'Family & parenting' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Father', description: 'Family & parenting' });
  });

  test('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/roles').send({ description: 'No name' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when name is empty string', async () => {
    const res = await request(app).post('/api/roles').send({ name: '' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/roles/:id', () => {
  let roleId;

  beforeEach(() => {
    const result = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)').run('Father', 'Family');
    roleId = result.lastInsertRowid;
  });

  test('updates the name', async () => {
    const res = await request(app).put(`/api/roles/${roleId}`).send({ name: 'Dad' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: roleId, name: 'Dad', description: 'Family' });
  });

  test('updates the description', async () => {
    const res = await request(app)
      .put(`/api/roles/${roleId}`)
      .send({ description: 'Updated description' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Father', description: 'Updated description' });
  });

  test('returns 404 for non-existent role', async () => {
    const res = await request(app).put('/api/roles/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/roles/:id', () => {
  let roleId;

  beforeEach(() => {
    const result = db.prepare('INSERT INTO roles (name) VALUES (?)').run('Father');
    roleId = result.lastInsertRowid;
  });

  test('deletes the role and returns { deleted: true }', async () => {
    const res = await request(app).delete(`/api/roles/${roleId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  test('deleted role does not appear in GET /api/roles', async () => {
    await request(app).delete(`/api/roles/${roleId}`);
    const res = await request(app).get('/api/roles');
    expect(res.body.find(r => r.id === roleId)).toBeUndefined();
  });

  test('returns 404 for non-existent role', async () => {
    const res = await request(app).delete('/api/roles/9999');
    expect(res.status).toBe(404);
  });
});
