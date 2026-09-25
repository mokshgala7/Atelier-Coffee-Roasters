import { Router } from 'express';
import { getReservations, createReservation } from '../controllers/reservationController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, getReservations);
router.post('/', optionalAuth, createReservation);

export default router;

