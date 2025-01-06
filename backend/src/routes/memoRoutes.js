import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createMemo,
  deleteMemo,
  getMemos,
  updateMemo,
} from "../controllers/memo/memoController.js";

const router = express.Router();

router.use(protect); // Protect all memo routes

router.route("/memos")
  .get(getMemos)
  .post(createMemo);

router.route("/memos/:id")
  .put(updateMemo)
  .delete(deleteMemo);

export default router;
