import { createApp } from './app.js';
import { validateRequiredEnv, getPort } from './config/env.js';
import { connectToDatabase } from './db/mongoose.js';

const app = createApp();

async function startServer() {
  try {
    validateRequiredEnv();
    await connectToDatabase();

    const port = getPort();
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
