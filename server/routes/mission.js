const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res) => {
  const mission = db.prepare('SELECT * FROM mission WHERE id = 1').get();
  res.json({ text: mission ? mission.text : '' });
});

router.put('/', (req, res) => {
  if (typeof req.body.text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  db.prepare('INSERT INTO mission (id, text) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET text = excluded.text').run(req.body.text);
  const mission = db.prepare('SELECT * FROM mission WHERE id = 1').get();
  res.json(mission);
});

module.exports = router;
