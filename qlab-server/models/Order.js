import mongoose from 'mongoose';

// Lược đồ lưu trữ Dữ liệu tĩnh (Snapshot) tại thời điểm mua
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    skuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],

    shippingAddress: {
        receiverName: { type: String, required: true },
        phone: { type: String, required: true },
        fullAddress: { type: String, required: true }
    },

    // Chỉ giữ lại COD
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },

    // Trạng thái thanh toán (Với COD, mặc định ban đầu luôn là PENDING)
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING'
    },

    totalAmount: { type: Number, required: true, default: 0.0 },

    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);