import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env.js';

import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// CORS Configuration (Dev + Production)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

if (env.frontendUrl && !allowedOrigins.includes(env.frontendUrl)) {
  allowedOrigins.push(env.frontendUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production' && origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Health & Database Status Endpoint (Never exposes credentials)
app.get('/api/health', (_request, response) => {
  const isConnected = mongoose.connection.readyState === 1;
  response.json({
    success: true,
    status: isConnected ? 'healthy' : 'degraded',
    service: 'cafe-ordering-backend',
    database: {
      status: isConnected ? 'connected' : 'disconnected',
      name: isConnected ? mongoose.connection.name : null
    },
    timestamp: new Date().toISOString()
  });
});

// Mounted API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;

