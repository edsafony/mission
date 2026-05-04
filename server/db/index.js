const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const migrate = require('./migrate');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'mission.db'));

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

migrate(db);

module.exports = db;
