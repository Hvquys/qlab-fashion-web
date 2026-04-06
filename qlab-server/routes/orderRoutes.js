import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả API Đơn hàng đều bắt buộc đăng nhập
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

export default router;