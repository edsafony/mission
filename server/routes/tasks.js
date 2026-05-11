const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { goal_id, text } = req.body;
  if (!goal_id || !text || text.trim() === '') {
    return res.status(400).json({ error: 'goal_id and text are required' });
  }
  const result = db.prepare('INSERT INTO tasks (goal_id, text, completed) VALUES (?, ?, 0)').run(goal_id, text.trim());
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;
  db.prepare('UPDATE tasks SET text = ?, completed = ? WHERE id = ?').run(text, completed, id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ deleted: true });
});

module.exports = router;
