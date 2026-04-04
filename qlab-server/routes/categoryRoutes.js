import express from 'express';
import { createCategory, getCategories, updateCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);

export default router;