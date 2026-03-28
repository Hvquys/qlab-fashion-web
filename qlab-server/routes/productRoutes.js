import express from 'express';
import upload from '../config/cloudinaryConfig.js';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(upload.single('image'), createProduct); // 'image' là tên field gửi từ frontend

router.route('/:id')
    .get(getProductById)
    .put(upload.single('image'), updateProduct)
    .delete(deleteProduct);

export default router;