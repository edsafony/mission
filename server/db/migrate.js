function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mission (
      id   INTEGER PRIMARY KEY CHECK (id = 1),
      text TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS roles (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      text    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id   INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      text      TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);
}

module.exports = migrate;
