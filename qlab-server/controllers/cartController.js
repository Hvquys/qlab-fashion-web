// controllers/cartController.js
import Cart from '../models/Cart.js';

// @desc    Lấy giỏ hàng của user hiện tại
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        // Chống N+1 Query: Chỉ populate những field cần thiết (name, images, price) để nhẹ payload
        let cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.product',
                select: 'name images basePrice slug'
            });

        // Nếu user mới đăng ký chưa có giỏ hàng, tạo giỏ rỗng trả về luôn
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Lọc bỏ những item bị lỗi (do admin xóa sản phẩm)
        cart.items = cart.items.filter(item => item.product != null);

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy giỏ hàng', error: error.message });
    }
};

// @desc    Thêm sản phẩm vào giỏ hoặc tăng số lượng nếu đã tồn tại
// @route   POST /api/v1/cart/add
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, variantId, skuId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // TH1: Chưa có giỏ -> Tạo mới
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, variantId, skuId, quantity }]
            });
        } else {
            // TH2: Tìm xem item này (Khớp cả 3 ID) đã có trong giỏ chưa
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId &&
                    item.variantId.toString() === variantId &&
                    item.skuId.toString() === skuId
            );

            if (itemIndex > -1) {
                // Đã tồn tại -> Cộng dồn
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Chưa tồn tại -> Thêm mới vào mảng
                cart.items.push({ product: productId, variantId, skuId, quantity });
            }
            await cart.save();
        }

        await cart.populate('items.product', 'name images basePrice slug');
        res.status(200).json({ success: true, message: 'Đã thêm vào giỏ', data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi thêm sản phẩm', error: error.message });
    }
};

// @desc    Cập nhật chính xác số lượng của 1 item (Dùng khi user gõ số vào ô input giỏ hàng)
// @route   PUT /api/v1/cart/update
// @access  Private
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId, skuId, quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Số lượng phải lớn hơn 0' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId &&
                item.variantId.toString() === variantId &&
                item.skuId.toString() === skuId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity; // Set số lượng mới
            await cart.save();
            await cart.populate('items.product', 'name images basePrice slug');
            res.status(200).json({ success: true, message: 'Đã cập nhật số lượng', data: cart });
        } else {
            res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật', error: error.message });
    }
};

// @desc    Xóa sản phẩm khỏi giỏ
// @route   DELETE /api/v1/cart/remove
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId, skuId } = req.body;

        // Tối ưu hóa: Dùng $pull để Engine MongoDB tự tìm và xóa item ra khỏi mảng
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
                $pull: {
                    items: { product: productId, variantId: variantId, skuId: skuId }
                }
            },
            { new: true }
        ).populate('items.product', 'name images basePrice slug');

        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm', data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm', error: error.message });
    }
};

// @desc    Xóa trắng toàn bộ giỏ hàng (Gọi sau khi đã tạo Order thành công)
// @route   DELETE /api/v1/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Đã làm sạch giỏ hàng', data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi clear giỏ hàng', error: error.message });
    }
};