const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

exports.processCheckout = async (userId, checkoutData) => {
    const { cartItems, shippingAddress, paymentMethod } = checkoutData;
    let totalAmount = 0;
    const orderSnapshot = [];

    // Khởi tạo Transaction Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const item of cartItems) {
            // Khóa tài liệu để tránh Race Condition (Concurrency)
            const product = await Product.findById(item.productId).session(session);
            if (!product || !product.isPublished) throw new Error(`Sản phẩm ${item.productId} không hợp lệ.`);

            const variant = product.variants.id(item.variantId);
            const sku = variant.skus.id(item.skuId);

            if (!sku) throw new Error('Phiên bản sản phẩm không tồn tại.');
            if (sku.stock < item.quantity) {
                throw new Error(`Sản phẩm ${product.name} (Size: ${sku.size}) đã hết hàng hoặc không đủ số lượng.`);
            }

            // 1. Cập nhật Order Snapshot (Bảo toàn dữ liệu giá, tên)
            const itemPrice = sku.price || product.basePrice;
            totalAmount += itemPrice * item.quantity;

            orderSnapshot.push({
                productId: product._id,
                name: product.name,
                color: variant.colorName,
                size: sku.size,
                priceAtPurchase: itemPrice,
                quantity: item.quantity,
                // Tự động tối ưu URL ảnh từ Cloudinary trước khi lưu
                image: variant.images[0].replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_500,h_500/')
            });

            // 2. Trừ tồn kho trực tiếp trong session
            sku.stock -= item.quantity;
            await product.save({ session });
        }

        // 3. Tạo đơn hàng mới
        const newOrder = await Order.create([{
            user: userId,
            items: orderSnapshot,
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderStatus: 'PENDING'
        }], { session });

        // 4. Xóa giỏ hàng sau khi đặt thành công
        await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { session });

        // Cam kết Transaction
        await session.commitTransaction();
        session.endSession();

        return newOrder[0];

    } catch (error) {
        // Nếu có bất kỳ lỗi gì (VD: Hết kho), Rollback toàn bộ (Không trừ kho, không tạo đơn)
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};