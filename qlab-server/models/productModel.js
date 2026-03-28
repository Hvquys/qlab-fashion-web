import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true }, // URL từ Cloudinary
        cloudinary_id: { type: String }, // Dùng để xóa ảnh khi xóa sản phẩm
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        countInStock: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;