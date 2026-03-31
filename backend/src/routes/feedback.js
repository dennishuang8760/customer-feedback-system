import { Router } from 'express';
import { query } from '../db.js';
import { scoreSentiment } from '../sentiment.js';

const router = Router();

// POST / — create feedback
router.post('/', async (req, res) => {
  const { content, author, category } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });

  const sentiment = scoreSentiment(content);
  const cat = category || 'other';

  const result = await query(
    `INSERT INTO feedback (content, author, sentiment, category) VALUES ($1, $2, $3, $4) RETURNING *`,
    [content, author || null, sentiment, cat]
  );
  res.status(201).json(result.rows[0]);
});

// GET / — list feedback with optional filters
router.get('/', async (req, res) => {
  const { sentiment, category, limit = 50, offset = 0 } = req.query;
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

  res.json({ items: itemsResult.rows, total: parseInt(countResult.rows[0].count) });
});

// GET /stats — aggregate counts
router.get('/stats', async (req, res) => {
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

  res.json({
    total: parseInt(totalResult.rows[0].count),
    by_sentiment,
    by_category,
  });
});

// GET /:id — single feedback item
router.get('/:id', async (req, res) => {
  const result = await query('SELECT * FROM feedback WHERE id = $1', [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'not found' });
  res.json(result.rows[0]);
});

export default router;
