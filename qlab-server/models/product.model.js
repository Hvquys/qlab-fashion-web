const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
    skuCode: { type: String, unique: true, required: true, uppercase: true },
    size: { type: String, required: true }, // VD: S, M, L, XL
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true } // Giá cụ thể cho size/màu này
});

const variantSchema = new mongoose.Schema({
    colorName: { type: String, required: true },
    colorCode: { type: String, required: true }, // Hex code
    images: [{ type: String, required: true }], // Cloudinary URLs
    skus: [skuSchema]
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, required: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    basePrice: { type: Number, required: true },

    variants: [variantSchema],

    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },

    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

// Text Index để phục vụ tính năng Search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ 'variants.skus.skuCode': 1 }); // Index cho kiểm tra kho nhanh

module.exports = mongoose.model('Product', productSchema);