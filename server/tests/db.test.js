const Database = require('better-sqlite3');
const migrate = require('../db/migrate');

let db;

function insertRole(name = 'Test Role') {
  return db.prepare('INSERT INTO roles (name) VALUES (?)').run(name).lastInsertRowid;
}

function insertWeek(startDate = '2026-01-06') {
  return db.prepare('INSERT INTO weeks (start_date) VALUES (?)').run(startDate).lastInsertRowid;
}

function insertGoal(weekId, roleId, text = 'Goal') {
  return db.prepare('INSERT INTO goals (week_id, role_id, text) VALUES (?, ?, ?)').run(weekId, roleId, text).lastInsertRowid;
}

function insertTask(goalId, text = 'Task') {
  return db.prepare('INSERT INTO tasks (goal_id, text) VALUES (?, ?)').run(goalId, text).lastInsertRowid;
}

beforeEach(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  migrate(db);
});

afterEach(() => {
  db.close();
});

describe('table existence', () => {
  test('all 5 tables are created', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all()
      .map(r => r.name);

    expect(tables).toEqual(expect.arrayContaining(['goals', 'mission', 'roles', 'tasks', 'weeks']));
    expect(tables).toHaveLength(5);
  });
});

describe('mission table', () => {
  test('text column defaults to empty string', () => {
    db.prepare('INSERT INTO mission (id) VALUES (1)').run();
    const row = db.prepare('SELECT text FROM mission WHERE id = 1').get();
    expect(row.text).toBe('');
  });

  test('inserting id=1 succeeds', () => {
    expect(() => {
      db.prepare("INSERT INTO mission (id, text) VALUES (1, 'hello')").run();
    }).not.toThrow();
  });

  test('inserting id=2 throws CHECK constraint violation', () => {
    expect(() => {
      db.prepare("INSERT INTO mission (id, text) VALUES (2, 'boom')").run();
    }).toThrow();
  });

  test('inserting id=1 twice throws UNIQUE violation', () => {
    db.prepare("INSERT INTO mission (id, text) VALUES (1, 'first')").run();
    expect(() => {
      db.prepare("INSERT INTO mission (id, text) VALUES (1, 'second')").run();
    }).toThrow();
  });
});

describe('tasks defaults and constraints', () => {
  test('completed defaults to 0', () => {
    const weekId = insertWeek();
    const roleId = insertRole();
    const goalId = insertGoal(weekId, roleId);
    const taskId = insertTask(goalId);

    const row = db.prepare('SELECT completed FROM tasks WHERE id = ?').get(taskId);
    expect(row.completed).toBe(0);
  });

  test('completed is NOT NULL', () => {
    const cols = db.prepare('PRAGMA table_info(tasks)').all();
    const completedCol = cols.find(c => c.name === 'completed');
    expect(completedCol.notnull).toBe(1);
  });
});

describe('NOT NULL constraints', () => {
  test('roles.name rejects null', () => {
    expect(() => {
      db.prepare('INSERT INTO roles (name) VALUES (?)').run(null);
    }).toThrow();
  });

  test('goals.week_id rejects null', () => {
    const roleId = insertRole();
    expect(() => {
      db.prepare('INSERT INTO goals (week_id, role_id, text) VALUES (?, ?, ?)').run(null, roleId, 'Goal');
    }).toThrow();
  });

  test('goals.role_id rejects null', () => {
    const weekId = insertWeek();
    expect(() => {
      db.prepare('INSERT INTO goals (week_id, role_id, text) VALUES (?, ?, ?)').run(weekId, null, 'Goal');
    }).toThrow();
  });

  test('tasks.text rejects null', () => {
    const weekId = insertWeek();
    const roleId = insertRole();
    const goalId = insertGoal(weekId, roleId);
    expect(() => {
      db.prepare('INSERT INTO tasks (goal_id, text) VALUES (?, ?)').run(goalId, null);
    }).toThrow();
  });
});

describe('UNIQUE constraints', () => {
  test('weeks.start_date rejects duplicate dates', () => {
    insertWeek('2026-01-06');
    expect(() => {
      insertWeek('2026-01-06');
    }).toThrow();
  });
});

describe('ON DELETE CASCADE', () => {
  test('deleting a week removes its goals', () => {
    const weekId = insertWeek();
    const roleId = insertRole();
    insertGoal(weekId, roleId);

    db.prepare('DELETE FROM weeks WHERE id = ?').run(weekId);

    const goals = db.prepare('SELECT * FROM goals WHERE week_id = ?').all(weekId);
    expect(goals).toHaveLength(0);
  });

  test('deleting a goal removes its tasks', () => {
    const weekId = insertWeek();
    const roleId = insertRole();
    const goalId = insertGoal(weekId, roleId);
    insertTask(goalId);

    db.prepare('DELETE FROM goals WHERE id = ?').run(goalId);

    const tasks = db.prepare('SELECT * FROM tasks WHERE goal_id = ?').all(goalId);
    expect(tasks).toHaveLength(0);
  });

  test('deleting a week cascades all the way to tasks', () => {
    const weekId = insertWeek();
    const roleId = insertRole();
    const goalId = insertGoal(weekId, roleId);
    insertTask(goalId);

    db.prepare('DELETE FROM weeks WHERE id = ?').run(weekId);

    const tasks = db.prepare('SELECT * FROM tasks').all();
    expect(tasks).toHaveLength(0);
  });
});
