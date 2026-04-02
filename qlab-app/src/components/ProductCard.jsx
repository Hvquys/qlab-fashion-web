import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="group relative bg-white flex flex-col h-full">
            {/* 1. Hình ảnh sản phẩm - Tăng trải nghiệm Click */}
            <Link to={`/product/${product._id}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-100 block">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                />

                {/* Overlay khi hover: Hiện nút nhanh với style "Lab" sắc sảo hơn */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    {/* Nút Xem nhanh (Eye) */}
                    <div className="bg-white text-black p-3 hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-sm">
                        <Eye size={18} />
                    </div>

                    {/* Nút Thêm nhanh (Plus/Cart) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Ngăn nhảy link khi bấm nút này
                            console.log("Thêm nhanh:", product.name);
                        }}
                        className="bg-black text-white p-3 hover:bg-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-sm"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* Tag trạng thái: Chuyển sang góc vuông cho đúng chất Lab */}
                {product.countInStock === 0 && (
                    <span className="absolute top-0 right-0 bg-zinc-400 text-white text-[9px] font-black px-3 py-1 uppercase tracking-tighter">
            Hết hàng
          </span>
                )}

                {product.discount > 0 && (
                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase italic tracking-widest">
            -{product.discount}%
          </span>
                )}
            </Link>

            {/* 2. Thông tin sản phẩm */}
            <div className="mt-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-bold">
                        {product.brand || 'Q-LAB'}
                    </p>
                    <span className="text-[9px] text-zinc-300 font-mono">#{product._id?.slice(-4)}</span>
                </div>

                <h3 className="text-xs font-black uppercase tracking-tight leading-tight mb-2 hover:text-red-600 transition-colors line-clamp-2">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>

                <div className="mt-auto pt-2 flex items-baseline gap-3">
          <span className="text-sm font-black italic tracking-tighter text-black">
            {product.price?.toLocaleString()}đ
          </span>
                    {product.oldPrice && (
                        <span className="text-[10px] text-zinc-400 line-through italic decoration-red-600/30">
              {product.oldPrice?.toLocaleString()}đ
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;