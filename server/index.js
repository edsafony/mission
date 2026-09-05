require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Only log requests when actually run as a server (not when tests import
// `app` directly via supertest) -- require.main is stable for the process.
const isStandalone = require.main === module;

app.use(cors());
app.use(express.json());

if (isStandalone) {
  let logSeq = 0;

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      logSeq += 1;
      console.log(
        `#${logSeq} ${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`
      );
    });
    next();
  });
}

app.use('/api', require('./routes/health'));
app.use('/api/mission', require('./routes/mission'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/weeks', require('./routes/weeks'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/tasks', require('./routes/tasks'));

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

if (isStandalone) {
  const db = require('./db');
  const migrate = require('./db/migrate');
  const PORT = process.env.PORT || 3001;

  migrate(db)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
