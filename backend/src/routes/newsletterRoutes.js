import { Router } from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletterController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

router.post('/', subscribe);
router.get('/', requireAdmin, getSubscribers);

export default router;
