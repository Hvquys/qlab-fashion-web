const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, required: true, lowercase: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Tối ưu truy xuất danh mục theo slug
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);