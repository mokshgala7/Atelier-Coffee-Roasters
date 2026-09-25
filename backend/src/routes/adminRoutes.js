import { Router } from 'express';
import { getAdminDashboard, getAllUsers } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/dashboard', requireAdmin, getAdminDashboard);
router.get('/users', requireAdmin, getAllUsers);

export default router;

