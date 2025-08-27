const Koa = require('koa');
const { Pool } = require('pg');
const app = new Koa();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.DB_HOST,     
  port: process.env.DB_PORT,     
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,  
});

// Ensure the table for tracking the counter exists and initialize it if empty
const ensureTableExists = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counters (
      id SERIAL PRIMARY KEY,
      count INT NOT NULL
    );
  `);

  const res = await pool.query('SELECT * FROM counters');
  if (res.rows.length === 0) {
    await pool.query('INSERT INTO counters (count) VALUES (0)');
  }
};

// Handle /ping requests and increment the counter
const handlePing = async (ctx) => {
  try {
    const result = await pool.query('UPDATE counters SET count = count + 1 RETURNING count');
    ctx.body = { pong: result.rows[0].count };
  } catch (error) {
    console.error('Error updating counter:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
};

// Check db
const checkDb = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

// Define the API routes, including the health check endpoint
app.use(async (ctx) => {
  if (ctx.path === '/ping' || ctx.path === '/pingpong') {  // Handle both paths
    await handlePing(ctx);
  } else if (ctx.path === '/') {  // Health check endpoint
    ctx.status = 200;
    ctx.body = 'OK';
  } else if (ctx.path === '/healthz') {
    const ok = await checkDb();
    ctx.status = ok ? 200 : 500;
    ctx.body = ok ? 'OK' : 'DB Not Ready';
  } else {
    ctx.status = 404;
    ctx.body = 'Not Found';
  }
});

// Start the server and ensure database table exists
app.listen(PORT, async () => {
  console.log(`Ping-pong app listening on port ${PORT}`);
  try {
    await ensureTableExists();
    console.log('Database connection established and table ensured.');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
  }
});