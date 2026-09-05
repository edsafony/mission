const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../lib/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM mission WHERE id = 1');
  res.json({ text: rows[0] ? rows[0].text : '' });
}));

router.put('/', asyncHandler(async (req, res) => {
  if (typeof req.body.text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO mission (id, text) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET text = excluded.text RETURNING *',
    [req.body.text]
  );
  res.json(rows[0]);
}));

module.exports = router;
