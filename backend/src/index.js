import { migrate } from './db.js';
import app from './app.js';

const PORT = process.env.PORT || 8000;

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
