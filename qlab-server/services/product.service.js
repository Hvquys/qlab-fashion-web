const Product = require('../models/product.model');

exports.getProducts = async (queryFilters) => {
    const { page = 1, limit = 12, sort, category, color, size, search } = queryFilters;

    // Xây dựng query object linh hoạt
    const query = { isPublished: true };
    if (category) query.category = category;
    if (color) query['variants.colorName'] = color;
    if (size) query['variants.skus.size'] = size;
    if (search) query.$text = { $search: search }; // Sử dụng Text Index

    // Xử lý sắp xếp (Mặc định mới nhất, có thể sort theo giá hoặc rating)
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { basePrice: 1 };
    if (sort === 'price_desc') sortOption = { basePrice: -1 };
    if (sort === 'top_rated') sortOption = { 'ratings.average': -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit)),
        Product.countDocuments(query)
    ]);

    return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        totalItems: total
    };
};

exports.getProductBySlug = async (slug) => {
    const product = await Product.findOne({ slug, isPublished: true }).populate('category', 'name slug');
    if (!product) throw new Error('Sản phẩm không tồn tại!');
    return product;
};