import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { uploadStream } from '../utils/cloudinaryUpload.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Tạo sản phẩm mới (Kèm upload nhiều ảnh)
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    // 1. Parse data (Vì dùng form-data nên các fields dạng mảng/object sẽ bị biến thành chuỗi JSON)
    const { name, slug, description, basePrice, category } = req.body;
    const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

    // 2. Xử lý upload mảng hình ảnh lên Cloudinary
    const imageUploadPromises = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            // Đẩy từng file dạng buffer lên folder 'products' trên Cloud
            imageUploadPromises.push(uploadStream(file.buffer, 'products'));
        }
    }

    // Đợi tất cả ảnh upload xong, lấy mảng kết quả { url, public_id }
    const uploadedImages = await Promise.all(imageUploadPromises);
    const formattedImages = uploadedImages.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
    }));

    // 3. Lưu vào Database
    const product = await Product.create({
        name,
        slug,
        description,
        basePrice,
        category,
        variants,
        images: formattedImages
    });

    res.status(201).json({ success: true, data: product });
});

// @desc    Lấy danh sách sản phẩm (Có phân trang & Lọc)
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12; // Mặc định 12 sp/trang
    const page = Number(req.query.page) || 1;

    // Xử lý bộ lọc tìm kiếm
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } } // Tìm kiếm chứa từ khóa (không phân biệt hoa thường)
        : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...categoryFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .populate('category', 'name slug') // Giải quyết N+1 query bằng 1 lệnh populate nhẹ nhàng
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        }
    });
});

// @desc    Lấy chi tiết 1 sản phẩm theo ID (Tốc độ ánh sáng nhờ Double Embedding)
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    // Lưu ý: Không cần Join lấy Biến thể và Hình ảnh vì chúng đã được NHÚNG SẴN trong Product!
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
        res.status(200).json({ success: true, data: product });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});

// @desc    Xóa sản phẩm (Và xóa luôn file ảnh vật lý trên Cloudinary)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }

    // Gọi API dọn rác trên Cloudinary để tránh tốn tiền lưu trữ
    if (product.images && product.images.length > 0) {
        for (const image of product.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' });
});