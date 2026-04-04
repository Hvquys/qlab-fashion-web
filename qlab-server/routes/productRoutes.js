import express from 'express';
import { createProduct, getProducts, getProductById, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
// Chặn quyền Admin và cấu hình multer nhận tối đa 5 file ảnh
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;