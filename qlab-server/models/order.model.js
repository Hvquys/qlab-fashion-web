const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },           // Snapshot
    color: { type: String, required: true },          // Snapshot
    size: { type: String, required: true },           // Snapshot
    priceAtPurchase: { type: Number, required: true },// Snapshot (Giá chốt)
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true }           // Snapshot (URL Cloudinary)
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],

    shippingAddress: {
        receiverName: { type: String, required: true },
        phone: { type: String, required: true },
        fullAddress: { type: String, required: true }
    },

    paymentMethod: { type: String, enum: ['COD', 'VNPAY', 'MOMO'], required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    transactionId: { type: String }, // Lưu mã giao dịch từ VNPAY/MOMO (nếu có)

    totalAmount: { type: Number, required: true },

    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    cancelReason: { type: String },
    trackingNumber: { type: String }
}, { timestamps: true });

// Tối ưu query lịch sử mua hàng của user
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);