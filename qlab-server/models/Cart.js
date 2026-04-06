// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // Lưu trữ định danh của phân loại hàng (Màu sắc, Kích thước)
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    skuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Số lượng sản phẩm tối thiểu là 1']
    }
}, { _id: false }); // Tắt _id phụ của từng item để tối ưu dung lượng document

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Quan hệ 1-1: Mỗi user chỉ có 1 giỏ hàng active
    },
    items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);