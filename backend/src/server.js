import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 5001;
const host = '0.0.0.0';

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Failed to initialize MongoDB connection at startup:', error.message);
  }

  app.listen(port, host, () => {
    console.log(`☕ Atelier Coffee Roasters API listening on ${host}:${port}`);
  });
}

startServer();
