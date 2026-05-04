const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  test('returns status 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  test('response body is { status: "ok" }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('Content-Type is application/json', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('wrong path returns 404', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.status).toBe(404);
  });
});
