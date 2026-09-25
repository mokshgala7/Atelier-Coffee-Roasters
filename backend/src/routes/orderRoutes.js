import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrdersByUser,
  getOrderById,
  deleteOrder
} from '../controllers/orderController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', requireAdmin, getOrders);
router.get('/user/:userId', requireAuth, getOrdersByUser);
router.get('/:id', requireAuth, getOrderById);
router.post('/', optionalAuth, createOrder);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;

