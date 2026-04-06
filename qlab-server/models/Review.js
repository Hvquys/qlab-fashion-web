import mongoose from 'mongoose';
import { imageSchema } from './schemas/Image.js';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true // Bắt buộc phải có ID đơn hàng để xác thực đã mua
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Đánh giá tối thiểu 1 sao'],
        max: [5, 'Đánh giá tối đa 5 sao']
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    images: [imageSchema] // Tối đa 5 ảnh Cloudinary (URL & public_id)
}, { timestamps: true });

// Đảm bảo 1 User chỉ được đánh giá 1 Sản phẩm trên 1 Đơn hàng duy nhất
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);