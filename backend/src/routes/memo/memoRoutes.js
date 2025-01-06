import express from 'express';
import {
  getMemos,
  createMemo,
  updateMemo,
  deleteMemo,
  shareMemo,
  getFolders,
  getTags,
  bulkAction
} from '../../controllers/memo/memoController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Basic CRUD routes
router.route('/')
  .get(getMemos)
  .post(createMemo);

router.route('/:id')
  .put(updateMemo)
  .delete(deleteMemo);

// Additional features
router.post('/:id/share', shareMemo);
router.get('/folders', getFolders);
router.get('/tags', getTags);
router.post('/bulk', bulkAction);

export default router;
