import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);     // Gọi API: POST /api/users (Để đăng ký)
router.post('/login', authUser);    // Gọi API: POST /api/users/login (Để đăng nhập)

export default router;