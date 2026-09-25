import { Router } from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', requireAuth, getUser);
router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUser);

export default router;

