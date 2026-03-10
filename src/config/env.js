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
    const error = new Error(`Missing required environment variables: ${missing.join(', ')}`);
    error.status = 500;
    throw error;
  }
}

export function getPort() {
  return Number(process.env.PORT) || 3000;
}
