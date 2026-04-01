import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { query } from './db.js';
import feedbackRouter from './routes/feedback.js';

const app = new Hono();

app.use('*', cors({ origin: '*' }));

app.get('/health', (c) => c.json({ status: 'ok' }));

app.get('/ready', async (c) => {
  try {
    await query('SELECT 1');
    return c.json({ status: 'ready' });
  } catch {
    return c.json({ status: 'not_ready' }, 503);
  }
});

app.route('/api/v1/feedback', feedbackRouter);

export default app;
