import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

// @desc    Khởi tạo đơn hàng (Ship COD)
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res) => {
    const { shippingAddress } = req.body; // Không cần nhận paymentMethod từ Client nữa
    const userId = req.user._id;

    // Khởi tạo Transaction Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Lấy giỏ hàng hiện tại của user
        const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error('Giỏ hàng trống, không thể đặt hàng!');
        }

        // 2. Chuyển đổi Cart Items thành Order Items (Tạo Snapshot)
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            // Lấy giá từ DB để bảo mật
            const itemPrice = item.product.basePrice;
            totalAmount += itemPrice * item.quantity;

            return {
                product: item.product._id,
                variantId: item.variantId,
                skuId: item.skuId,
                name: item.product.name,
                price: itemPrice,
                quantity: item.quantity,
                image: item.product.images[0].url
            };
        });

        // 3. Khởi tạo Order trong DB
        const order = await Order.create([{
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod: 'COD', // Mặc định cứng là COD
            totalAmount,
            paymentStatus: 'PENDING',
            orderStatus: 'PENDING'
        }], { session });

        // 4. Clear giỏ hàng sau khi đặt thành công
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { session }
        );

        // 5. Xác nhận Transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Đặt hàng thành công! Đơn hàng sẽ được thanh toán khi nhận hàng (COD).',
            data: order[0]
        });

    } catch (error) {
        // Rút lại toàn bộ thao tác nếu có lỗi
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Lấy lịch sử đơn hàng của User
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng' });
    }
};