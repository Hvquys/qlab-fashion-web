import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// --------------------------------------------------------
// THUẬT TOÁN AUTO-CALCULATE (Chỉ chạy nội bộ trong Backend)
// --------------------------------------------------------
const updateProductRatingStats = async (productId) => {
    try {
        // Pipeline gom nhóm và tính toán (Tương đương GROUP BY trong SQL)
        const stats = await Review.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: '$product',
                    ratingAverage: { $avg: '$rating' },
                    ratingCount: { $sum: 1 }
                }
            }
        ]);

        // Cập nhật thẳng vào collection Products
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10, // Làm tròn 1 chữ số thập phân (VD: 4.5)
                ratingCount: stats[0].ratingCount
            });
        } else {
            // Trường hợp Admin xóa hết review của sản phẩm
            await Product.findByIdAndUpdate(productId, { ratingAverage: 0, ratingCount: 0 });
        }
    } catch (error) {
        console.error('Lỗi khi tính toán rating:', error);
    }
};

// --------------------------------------------------------
// API CHO FRONTEND
// --------------------------------------------------------

// @desc    Tạo đánh giá mới (Chỉ dành cho user đã mua và nhận hàng)
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating, comment, images } = req.body;
        const userId = req.user._id;

        // 1. KẾT HỢP KIỂM TRA ĐIỀU KIỆN KÉP
        // Kiểm tra xem đơn hàng này có thuộc về user, chứa sản phẩm này và đã DELIVERED chưa?
        const validOrder = await Order.findOne({
            _id: orderId,
            user: userId,
            orderStatus: 'DELIVERED',
            'orderItems.product': productId
        });

        if (!validOrder) {
            return res.status(403).json({
                success: false,
                message: 'Bạn chưa mua sản phẩm này hoặc đơn hàng chưa được giao thành công.'
            });
        }

        // 2. Tạo Review
        const newReview = await Review.create({
            user: userId,
            product: productId,
            order: orderId,
            rating,
            comment,
            images // URL ảnh từ Cloudinary do Frontend gọi API Upload truyền xuống
        });

        // 3. Kích hoạt thuật toán tính lại điểm cho sản phẩm (Chạy bất đồng bộ, không cần await để block luồng phản hồi)
        updateProductRatingStats(productId);

        res.status(201).json({ success: true, message: 'Đánh giá thành công', data: newReview });
    } catch (error) {
        // Bắt lỗi Duplicate Index (User cố tình gọi API 2 lần cho 1 đơn)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng rồi.' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Lấy toàn bộ đánh giá của 1 sản phẩm
// @route   GET /api/v1/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'fullName avatar') // Chỉ lấy Tên và Avatar của người đánh giá
            .sort({ createdAt: -1 }); // Mới nhất lên đầu

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};