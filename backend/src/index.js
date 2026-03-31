import express from 'express';
import cors from 'cors';
import { migrate } from './db.js';
import feedbackRouter from './routes/feedback.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1/feedback', feedbackRouter);

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
