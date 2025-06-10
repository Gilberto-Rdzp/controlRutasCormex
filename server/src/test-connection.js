// Test PostgreSQL connection
const db = require('./config/db.config');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Current database time:', result.rows[0].now);
    await db.pool.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection(); 