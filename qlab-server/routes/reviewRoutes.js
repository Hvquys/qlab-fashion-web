import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy danh sách review là Public (Ai cũng xem được)
router.get('/product/:productId', getProductReviews);

// Đăng review bắt buộc phải đăng nhập
router.post('/', protect, createReview);

export default router;