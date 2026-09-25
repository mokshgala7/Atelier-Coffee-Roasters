import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Failed to initialize MongoDB connection at startup:', error.message);
  }

  app.listen(port, () => {
    console.log(`☕ Atelier Coffee Roasters API listening on port ${port}`);
  });
}

startServer();
