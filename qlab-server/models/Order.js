import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true }, // Snapshot tên
    variantInfo: { color: String, size: String },  // Snapshot biến thể
    priceAtPurchase: { type: Number, required: true }, // Snapshot giá
    quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    shippingAddress: { // Snapshot địa chỉ
        receiverName: String,
        phone: String,
        fullAddress: String
    },
    paymentMethod: { type: String, enum: ['COD', 'VNPAY'], default: 'COD' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    totalAmount: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);