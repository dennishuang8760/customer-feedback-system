/**
 * Node.js entry point (Docker Compose / local dev).
 * Uses pg for local Postgres and @hono/node-server to serve Hono.
 */
import pg from 'pg';
import { serve } from '@hono/node-server';
import { initDb, SCHEMA } from './db.js';
import app from './app.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://feedbackapp:devpassword@db:5432/feedback_dev',
});

initDb((text, params) => pool.query(text, params));

pool.query(SCHEMA)
  .then(() => {
    const port = parseInt(process.env.PORT || '8000');
    serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
