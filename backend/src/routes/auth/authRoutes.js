import express from 'express';
import { register, login, logout, getCurrentUser } from '../../controllers/auth/authController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

export default router;
