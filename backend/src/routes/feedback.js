import { Hono } from 'hono';
import { query } from '../db.js';
import { scoreSentiment } from '../sentiment.js';

const router = new Hono();

// POST / — create feedback
router.post('/', async (c) => {
  const { content, author, category } = await c.req.json();
  if (!content) return c.json({ error: 'content is required' }, 400);

  const sentiment = scoreSentiment(content);
  const cat = category || 'other';

  const result = await query(
    `INSERT INTO feedback (content, author, sentiment, category) VALUES ($1, $2, $3, $4) RETURNING *`,
    [content, author || null, sentiment, cat]
  );
  return c.json(result.rows[0], 201);
});

// GET / — list feedback with optional filters
router.get('/', async (c) => {
  const sentiment = c.req.query('sentiment');
  const category = c.req.query('category');
  const limit = c.req.query('limit') || '50';
  const offset = c.req.query('offset') || '0';

  const conditions = [];
  const values = [];
  let idx = 1;

  if (sentiment) {
    conditions.push(`sentiment = $${idx++}`);
    values.push(sentiment);
  }
  if (category) {
    conditions.push(`category = $${idx++}`);
    values.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const itemsResult = await query(
    `SELECT * FROM feedback ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, parseInt(limit), parseInt(offset)]
  );
  const countResult = await query(
    `SELECT COUNT(*) FROM feedback ${where}`,
    values
  );

  return c.json({ items: itemsResult.rows, total: parseInt(countResult.rows[0].count) });
});

// GET /stats — aggregate counts
router.get('/stats', async (c) => {
  const totalResult = await query('SELECT COUNT(*) FROM feedback');
  const sentimentResult = await query(
    `SELECT sentiment, COUNT(*) FROM feedback GROUP BY sentiment`
  );
  const categoryResult = await query(
    `SELECT category, COUNT(*) FROM feedback GROUP BY category`
  );

  const by_sentiment = { positive: 0, neutral: 0, negative: 0 };
  for (const row of sentimentResult.rows) {
    by_sentiment[row.sentiment] = parseInt(row.count);
  }

  const by_category = {};
  for (const row of categoryResult.rows) {
    by_category[row.category] = parseInt(row.count);
  }

  return c.json({
    total: parseInt(totalResult.rows[0].count),
    by_sentiment,
    by_category,
  });
});

// GET /:id — single feedback item
router.get('/:id', async (c) => {
  const result = await query('SELECT * FROM feedback WHERE id = $1', [c.req.param('id')]);
  if (!result.rows.length) return c.json({ error: 'not found' }, 404);
  return c.json(result.rows[0]);
});

export default router;
