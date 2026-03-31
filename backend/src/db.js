import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://feedbackapp:devpassword@db:5432/feedback_dev',
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT NOT NULL,
      author TEXT,
      sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
      category TEXT DEFAULT 'other',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}
