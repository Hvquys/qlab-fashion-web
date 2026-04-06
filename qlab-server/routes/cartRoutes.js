// routes/cartRoutes.js
import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Nhúng middleware xác thực JWT

const router = express.Router();

// Tất cả API của Cart đều yêu cầu user phải đăng nhập (có token)
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItemQuantity);
router.delete('/remove', removeFromCart); // Nhận data qua req.body
router.delete('/clear', clearCart);

export default router;