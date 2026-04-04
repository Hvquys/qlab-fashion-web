import mongoose from 'mongoose';
import { imageSchema } from './schemas/Image.js';

const variantSchema = new mongoose.Schema({
    skuId: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    priceExtra: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    images: [imageSchema],
    variants: [variantSchema],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);