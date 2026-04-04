import mongoose from 'mongoose';
import { imageSchema } from './schemas/Image.js';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    images: [imageSchema] // Khách hàng có thể đính kèm ảnh feedback
}, { timestamps: true });

// 1 User chỉ được review 1 Product 1 lần trên 1 Order cụ thể
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
