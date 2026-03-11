import { AppError } from '../utils/app_error.js';

const REQUIRED_ENV_VARS = [
  'MONGODB_URL',
  'JWT_SECRET',
  'JWT_ISSUER',
  'JWT_AUDIENCE',
  'OTP_PEPPER'
];

export function validateRequiredEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new AppError(500, `Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function getPort() {
  return Number(process.env.PORT) || 3000;
}
