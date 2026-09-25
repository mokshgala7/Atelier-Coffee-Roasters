import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrdersByUser,
  getOrderById,
  deleteOrder
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/user/:userId', getOrdersByUser);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
