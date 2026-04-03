const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

exports.addReview = async (userId, reviewData) => {
    const { productId, orderId, rating, comment, images } = reviewData;

    // Kiểm tra xem user đã thực sự mua món hàng này trong đơn hàng này chưa và đơn đã giao chưa
    const isValidOrder = await Order.findOne({
        _id: orderId,
        user: userId,
        'items.productId': productId,
        orderStatus: 'DELIVERED' // Chỉ cho phép đánh giá khi đã nhận hàng
    });

    if (!isValidOrder) throw new Error('Bạn chưa mua sản phẩm này hoặc đơn hàng chưa hoàn tất!');

    // Tạo Review mới
    const review = await Review.create({
        product: productId,
        user: userId,
        order: orderId,
        rating,
        comment,
        images
    });

    // TỰ ĐỘNG TÍNH LẠI ĐIỂM ĐÁNH GIÁ (Aggregation Pipeline)
    const stats = await Review.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    // Cập nhật lại số sao vào Product (Làm tròn 1 chữ số thập phân)
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
            'ratings.count': stats[0].totalReviews
        });
    }

    return review;
};