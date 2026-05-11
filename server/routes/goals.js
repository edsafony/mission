const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { week_id, role_id, text } = req.body;
  if (!week_id || !role_id || !text || text.trim() === '') {
    return res.status(400).json({ error: 'week_id, role_id, and text are required' });
  }
  const result = db.prepare('INSERT INTO goals (week_id, role_id, text) VALUES (?, ?, ?)').run(week_id, role_id, text.trim());
  const goal = db.prepare(`
    SELECT g.*, r.name AS role_name
    FROM goals g JOIN roles r ON r.id = g.role_id
    WHERE g.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(goal);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Goal not found' });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  db.prepare('UPDATE goals SET text = ? WHERE id = ?').run(text, id);
  const updated = db.prepare(`
    SELECT g.*, r.name AS role_name
    FROM goals g JOIN roles r ON r.id = g.role_id
    WHERE g.id = ?
  `).get(id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Goal not found' });
  db.prepare('DELETE FROM goals WHERE id = ?').run(id);
  res.json({ deleted: true });
});

module.exports = router;
