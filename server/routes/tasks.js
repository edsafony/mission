const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../lib/asyncHandler');

router.post('/', asyncHandler(async (req, res) => {
  const { goal_id, text } = req.body;
  if (!goal_id || !text || text.trim() === '') {
    return res.status(400).json({ error: 'goal_id and text are required' });
  }
  const { rows } = await db.query(
    'INSERT INTO tasks (goal_id, text, completed) VALUES ($1, $2, 0) RETURNING *',
    [goal_id, text.trim()]
  );
  res.status(201).json(rows[0]);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows: existingRows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;
  const { rows } = await db.query(
    'UPDATE tasks SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
    [text, completed, id]
  );
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  res.json({ deleted: true });
}));

module.exports = router;
