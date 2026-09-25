export const env = {
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production'
    ? (() => { throw new Error('FATAL: JWT_SECRET environment variable is required in production.'); })()
    : 'atelier_coffee_roasters_jwt_secret_key_2026'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};


