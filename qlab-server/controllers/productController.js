import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

// 1. Lấy toàn bộ sản phẩm
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        logger.error(`Lỗi lấy danh sách: ${error.message}`);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Lấy chi tiết (Bỏ log hoàn toàn)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    } catch (error) {
        res.status(404).json({ message: 'ID sản phẩm không hợp lệ' });
    }
};

// 3. Tạo mới sản phẩm (Có cơ chế xóa ảnh nếu lỗi DB)
export const createProduct = async (req, res) => {
    const newCloudinaryId = req.file ? req.file.filename : null;

    try {
        if (req.file) logger.upload(req.file.path);

        const product = new Product({
            ...req.body,
            image: req.file ? req.file.path : '/images/sample.jpg',
            cloudinary_id: newCloudinaryId,
        });

        await product.save();
        logger.success(`Đã tạo sản phẩm: ${req.body.name}`);
        res.status(201).json(product);
    } catch (error) {
        // ROLLBACK: Nếu lỗi DB, xóa ảnh vừa up lên Cloudinary ngay lập tức
        if (newCloudinaryId) {
            await cloudinary.uploader.destroy(newCloudinaryId);
            logger.error(`Đã Rollback: Xóa ảnh rác trên Cloudinary do lỗi DB`);
        }
        logger.error(`Lỗi tạo: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// 4. Cập nhật sản phẩm (Log khi đổi ảnh & Rollback nếu lỗi)
export const updateProduct = async (req, res) => {
    const newCloudinaryId = req.file ? req.file.filename : null;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // Nếu không tìm thấy SP nhưng lỡ up ảnh mới -> Xóa ảnh mới luôn
            if (newCloudinaryId) await cloudinary.uploader.destroy(newCloudinaryId);
            return res.status(404).json({ message: 'Không tìm thấy' });
        }

        const oldCloudinaryId = product.cloudinary_id;

        if (req.file) {
            logger.upload(req.file.path);
            product.image = req.file.path;
            product.cloudinary_id = newCloudinaryId;
        }

        Object.assign(product, req.body);
        await product.save();

        // Nếu lưu thành công VÀ có upload ảnh mới -> Lúc này mới xóa ảnh cũ
        if (req.file && oldCloudinaryId) {
            await cloudinary.uploader.destroy(oldCloudinaryId);
        }

        res.json(product);
    } catch (error) {
        // ROLLBACK: Nếu lỗi trong quá trình save, xóa cái ảnh vừa mới up lên
        if (newCloudinaryId) {
            await cloudinary.uploader.destroy(newCloudinaryId);
        }
        logger.error(`Lỗi cập nhật: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// 5. Xóa sản phẩm (Dọn dẹp cả ảnh trên Cloudinary)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            if (product.cloudinary_id) {
                await cloudinary.uploader.destroy(product.cloudinary_id);
            }
            await product.deleteOne();
            logger.success(`Đã xóa SP & Ảnh: ${req.params.id}`);
            res.json({ message: 'Đã xóa thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        logger.error(`Lỗi xóa: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};