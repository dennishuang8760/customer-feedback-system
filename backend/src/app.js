import { Hono } from 'hono';
import { cors } from 'hono/cors';
import feedbackRouter from './routes/feedback.js';

const app = new Hono();

app.use('*', cors({ origin: '*' }));
app.route('/api/v1/feedback', feedbackRouter);

export default app;
