import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/me', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
