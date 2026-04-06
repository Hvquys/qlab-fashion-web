import express from 'express';
import { getUserProfile, updateAddress } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Yêu cầu đăng nhập

router.get('/profile', getUserProfile);
router.put('/address', updateAddress); // Dùng PUT vì đây là hành động cập nhật

export default router;