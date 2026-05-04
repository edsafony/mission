const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  const roles = db.prepare('SELECT * FROM roles ORDER BY id').all();
  res.json(roles);
});

router.post('/', (req, res) => {
  const { name, description = null } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  const result = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)').run(name.trim(), description);
  const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(role);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Role not found' });

  const name = req.body.name !== undefined ? req.body.name : existing.name;
  const description = req.body.description !== undefined ? req.body.description : existing.description;

  db.prepare('UPDATE roles SET name = ?, description = ? WHERE id = ?').run(name, description, id);
  const updated = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Role not found' });

  db.prepare('DELETE FROM roles WHERE id = ?').run(id);
  res.json({ deleted: true });
});

module.exports = router;
