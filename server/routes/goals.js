const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../lib/asyncHandler');

router.post('/', asyncHandler(async (req, res) => {
  const { week_id, role_id, text } = req.body;
  if (!week_id || !role_id || !text || text.trim() === '') {
    return res.status(400).json({ error: 'week_id, role_id, and text are required' });
  }
  const { rows: inserted } = await db.query(
    'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING *',
    [week_id, role_id, text.trim()]
  );
  const { rows } = await db.query(`
    SELECT g.*, r.name AS role_name
    FROM goals g JOIN roles r ON r.id = g.role_id
    WHERE g.id = $1
  `, [inserted[0].id]);
  res.status(201).json(rows[0]);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows: existingRows } = await db.query('SELECT * FROM goals WHERE id = $1', [id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ error: 'Goal not found' });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  await db.query('UPDATE goals SET text = $1 WHERE id = $2', [text, id]);
  const { rows } = await db.query(`
    SELECT g.*, r.name AS role_name
    FROM goals g JOIN roles r ON r.id = g.role_id
    WHERE g.id = $1
  `, [id]);
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await db.query('DELETE FROM goals WHERE id = $1 RETURNING *', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Goal not found' });
  res.json({ deleted: true });
}));

module.exports = router;
