const db = require('../db');

async function clearTables() {
  await db.query('TRUNCATE mission, roles, weeks, goals, tasks RESTART IDENTITY CASCADE');
}

async function insertRole(name = 'Test Role') {
  const { rows } = await db.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [name]);
  return rows[0].id;
}

async function insertWeek(startDate = '2026-01-06') {
  const { rows } = await db.query('INSERT INTO weeks (start_date) VALUES ($1) RETURNING id', [startDate]);
  return rows[0].id;
}

async function insertGoal(weekId, roleId, text = 'Goal') {
  const { rows } = await db.query(
    'INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3) RETURNING id',
    [weekId, roleId, text]
  );
  return rows[0].id;
}

async function insertTask(goalId, text = 'Task') {
  const { rows } = await db.query('INSERT INTO tasks (goal_id, text) VALUES ($1, $2) RETURNING id', [goalId, text]);
  return rows[0].id;
}

beforeEach(async () => {
  await clearTables();
});

describe('table existence', () => {
  test('all 5 tables are created', async () => {
    const { rows } = await db.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    const tables = rows.map(r => r.table_name);

    expect(tables).toEqual(expect.arrayContaining(['goals', 'mission', 'roles', 'tasks', 'weeks']));
    expect(tables).toHaveLength(5);
  });
});

describe('mission table', () => {
  test('text column defaults to empty string', async () => {
    await db.query('INSERT INTO mission (id) VALUES (1)');
    const { rows } = await db.query('SELECT text FROM mission WHERE id = 1');
    expect(rows[0].text).toBe('');
  });

  test('inserting id=1 succeeds', async () => {
    await expect(db.query("INSERT INTO mission (id, text) VALUES (1, 'hello')")).resolves.toBeDefined();
  });

  test('inserting id=2 throws CHECK constraint violation', async () => {
    await expect(db.query("INSERT INTO mission (id, text) VALUES (2, 'boom')")).rejects.toThrow();
  });

  test('inserting id=1 twice throws UNIQUE violation', async () => {
    await db.query("INSERT INTO mission (id, text) VALUES (1, 'first')");
    await expect(db.query("INSERT INTO mission (id, text) VALUES (1, 'second')")).rejects.toThrow();
  });
});

describe('tasks defaults and constraints', () => {
  test('completed defaults to 0', async () => {
    const weekId = await insertWeek();
    const roleId = await insertRole();
    const goalId = await insertGoal(weekId, roleId);
    const taskId = await insertTask(goalId);

    const { rows } = await db.query('SELECT completed FROM tasks WHERE id = $1', [taskId]);
    expect(rows[0].completed).toBe(0);
  });

  test('completed is NOT NULL', async () => {
    const { rows } = await db.query(`
      SELECT is_nullable FROM information_schema.columns
      WHERE table_name = 'tasks' AND column_name = 'completed'
    `);
    expect(rows[0].is_nullable).toBe('NO');
  });
});

describe('NOT NULL constraints', () => {
  test('roles.name rejects null', async () => {
    await expect(db.query('INSERT INTO roles (name) VALUES ($1)', [null])).rejects.toThrow();
  });

  test('goals.week_id rejects null', async () => {
    const roleId = await insertRole();
    await expect(
      db.query('INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3)', [null, roleId, 'Goal'])
    ).rejects.toThrow();
  });

  test('goals.role_id rejects null', async () => {
    const weekId = await insertWeek();
    await expect(
      db.query('INSERT INTO goals (week_id, role_id, text) VALUES ($1, $2, $3)', [weekId, null, 'Goal'])
    ).rejects.toThrow();
  });

  test('tasks.text rejects null', async () => {
    const weekId = await insertWeek();
    const roleId = await insertRole();
    const goalId = await insertGoal(weekId, roleId);
    await expect(db.query('INSERT INTO tasks (goal_id, text) VALUES ($1, $2)', [goalId, null])).rejects.toThrow();
  });
});

describe('UNIQUE constraints', () => {
  test('weeks.start_date rejects duplicate dates', async () => {
    await insertWeek('2026-01-06');
    await expect(insertWeek('2026-01-06')).rejects.toThrow();
  });
});

describe('ON DELETE CASCADE', () => {
  test('deleting a week removes its goals', async () => {
    const weekId = await insertWeek();
    const roleId = await insertRole();
    await insertGoal(weekId, roleId);

    await db.query('DELETE FROM weeks WHERE id = $1', [weekId]);

    const { rows } = await db.query('SELECT * FROM goals WHERE week_id = $1', [weekId]);
    expect(rows).toHaveLength(0);
  });

  test('deleting a goal removes its tasks', async () => {
    const weekId = await insertWeek();
    const roleId = await insertRole();
    const goalId = await insertGoal(weekId, roleId);
    await insertTask(goalId);

    await db.query('DELETE FROM goals WHERE id = $1', [goalId]);

    const { rows } = await db.query('SELECT * FROM tasks WHERE goal_id = $1', [goalId]);
    expect(rows).toHaveLength(0);
  });

  test('deleting a week cascades all the way to tasks', async () => {
    const weekId = await insertWeek();
    const roleId = await insertRole();
    const goalId = await insertGoal(weekId, roleId);
    await insertTask(goalId);

    await db.query('DELETE FROM weeks WHERE id = $1', [weekId]);

    const { rows } = await db.query('SELECT * FROM tasks');
    expect(rows).toHaveLength(0);
  });
});
