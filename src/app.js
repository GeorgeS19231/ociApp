import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { userRouter } from './routes/user.js';
import { jobRouter } from './routes/job.js';
import { profileRoute } from './routes/profile.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { error: 'Too many requests, please try again later' }
  }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());

  app.use(userRouter);
  app.use(jobRouter);
  app.use(profileRoute);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ error: message });
  });

  return app;
}
