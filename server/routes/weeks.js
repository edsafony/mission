const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../lib/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM weeks ORDER BY start_date');
  res.json(rows);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { start_date } = req.body;
  if (!start_date || start_date.trim() === '') {
    return res.status(400).json({ error: 'start_date is required' });
  }
  const trimmed = start_date.trim();
  const { rows: existingRows } = await db.query('SELECT * FROM weeks WHERE start_date = $1', [trimmed]);
  if (existingRows[0]) return res.status(409).json(existingRows[0]);

  const { rows } = await db.query('INSERT INTO weeks (start_date) VALUES ($1) RETURNING *', [trimmed]);
  res.status(201).json(rows[0]);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { rows: weekRows } = await db.query('SELECT * FROM weeks WHERE id = $1', [id]);
  const week = weekRows[0];
  if (!week) return res.status(404).json({ error: 'Week not found' });

  const { rows: goals } = await db.query(`
    SELECT g.*, r.name AS role_name
    FROM goals g JOIN roles r ON r.id = g.role_id
    WHERE g.week_id = $1
    ORDER BY g.id
  `, [id]);

  const { rows: tasks } = await db.query(`
    SELECT t.* FROM tasks t
    JOIN goals g ON g.id = t.goal_id
    WHERE g.week_id = $1
    ORDER BY t.id
  `, [id]);

  const tasksByGoalId = {};
  for (const task of tasks) {
    if (!tasksByGoalId[task.goal_id]) tasksByGoalId[task.goal_id] = [];
    tasksByGoalId[task.goal_id].push(task);
  }

  res.json({
    ...week,
    goals: goals.map(g => ({ ...g, tasks: tasksByGoalId[g.id] ?? [] })),
  });
}));

module.exports = router;
