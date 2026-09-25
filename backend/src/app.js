import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health & Database Status Endpoint (Never exposes credentials)
app.get('/api/health', (_request, response) => {
  const isConnected = mongoose.connection.readyState === 1;
  response.json({
    status: isConnected ? 'healthy' : 'degraded',
    service: 'cafe-ordering-backend',
    database: {
      status: isConnected ? 'connected' : 'disconnected',
      name: isConnected ? mongoose.connection.name : null,
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

export default app;
