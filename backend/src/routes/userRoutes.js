import { Router } from 'express';
import { getUser } from '../controllers/userController.js';
const router = Router();
router.get('/me', getUser);
export default router;
