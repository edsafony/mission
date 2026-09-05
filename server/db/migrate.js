async function migrate(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS mission (
      id   INTEGER PRIMARY KEY CHECK (id = 1),
      text TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS roles (
      id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      start_date TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      text    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      goal_id   INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      text      TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);
}

module.exports = migrate;
