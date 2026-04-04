import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Tạo danh mục mới
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
        res.status(400);
        throw new Error('Danh mục với slug này đã tồn tại');
    }

    const category = await Category.create({ name, slug });

    res.status(201).json({ success: true, data: category });
});

// @desc    Lấy tất cả danh mục đang hoạt động
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
});

// @desc    Cập nhật danh mục
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Không tìm thấy danh mục');
    }

    category.name = name || category.name;
    category.slug = slug || category.slug;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();
    res.status(200).json({ success: true, data: updatedCategory });
});