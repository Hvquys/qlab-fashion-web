import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="group relative bg-white">
            {/* 1. Hình ảnh sản phẩm */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay khi hover: Hiện nút nhanh */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button className="bg-white text-black p-3 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-xl">
                        <ShoppingCart size={20} />
                    </button>
                    <Link to={`/product/${product._id}`} className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-xl">
                        <Eye size={20} />
                    </Link>
                </div>

                {/* Tag giảm giá hoặc New (nếu có) */}
                {product.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            -{product.discount}%
          </span>
                )}
            </div>

            {/* 2. Thông tin sản phẩm */}
            <div className="mt-4 space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">{product.category}</p>
                <h3 className="text-sm font-bold uppercase tracking-tight hover:text-red-600 transition">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black italic">{product.price?.toLocaleString()}đ</span>
                    {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through italic">{product.oldPrice?.toLocaleString()}đ</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;