import express from 'express';
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logoutUser); // Yêu cầu đăng nhập mới được logout

export default router;