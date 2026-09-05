const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../lib/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM roles ORDER BY id');
  res.json(rows);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, description = null } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
    [name.trim(), description]
  );
  res.status(201).json(rows[0]);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows: existingRows } = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ error: 'Role not found' });

  const name = req.body.name !== undefined ? req.body.name : existing.name;
  const description = req.body.description !== undefined ? req.body.description : existing.description;

  const { rows } = await db.query(
    'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Role not found' });
  res.json({ deleted: true });
}));

module.exports = router;
