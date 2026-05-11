const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  const weeks = db.prepare('SELECT * FROM weeks ORDER BY start_date').all();
  res.json(weeks);
});

router.post('/', (req, res) => {
  const { start_date } = req.body;
  if (!start_date || start_date.trim() === '') {
    return res.status(400).json({ error: 'start_date is required' });
  }
  const existing = db.prepare('SELECT * FROM weeks WHERE start_date = ?').get(start_date.trim());
  if (existing) return res.status(409).json(existing);

  const result = db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run(start_date.trim());
  const week = db.prepare('SELECT * FROM weeks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(week);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const week = db.prepare('SELECT * FROM weeks WHERE id = ?').get(id);
  if (!week) return res.status(404).json({ error: 'Week not found' });
  res.json(week);
});

module.exports = router;
