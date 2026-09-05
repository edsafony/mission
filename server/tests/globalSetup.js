require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.test') });

const { Pool } = require('pg');
const migrate = require('../db/migrate');

module.exports = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await migrate({ query: (text, params) => pool.query(text, params) });
  await pool.end();
};
