import express from 'express';
import {
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả các route liên quan đến sổ địa chỉ đều cần phải đăng nhập
router.use(protect);

// Prefix định tuyến trong server.js sẽ là /api/v1/users
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/addresses/:addressId/default', setDefaultAddress);

export default router;