import express from 'express';
import cors from 'cors';
import feedbackRouter from './routes/feedback.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1/feedback', feedbackRouter);

export default app;
