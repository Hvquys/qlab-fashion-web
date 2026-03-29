import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ArrowRight, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Giả lập gọi API
                const { data } = await axios.get('/api/v1/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Hàm render Section để code cực sạch
    const renderCategorySection = (title, categoryName) => {
        const filtered = products.filter(p => p.category === categoryName).slice(0, 4);

        if (loading) return (
            <div className="container mx-auto px-4 py-12 animate-pulse grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-zinc-100"></div>)}
            </div>
        );

        return (
            <section className="container mx-auto px-4 py-16 border-b border-zinc-50 last:border-none">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.4em]">Essential</span>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mt-1">{title}</h2>
                    </div>
                    <Link to={`/shop?category=${categoryName}`} className="group flex items-center text-[11px] font-black uppercase tracking-widest hover:text-red-600 transition">
                        Khám phá thêm <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {filtered.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        );
    };

    return (
        <main className="bg-white">
            {/* 1. HERO SECTION */}
            <section className="relative h-[85vh] bg-zinc-900 flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                </div>
                <div className="container mx-auto px-4 z-10 text-white">
                    <p className="uppercase tracking-[0.8em] text-[10px] mb-6 font-bold text-zinc-400 flex items-center gap-2">
                        <MousePointer2 size={12} /> Scroll to explore
                    </p>
                    <h1 className="text-7xl md:text-[120px] font-black leading-[0.8] mb-10 tracking-tighter uppercase">
                        Lab<br/><span className="text-red-600">Series.</span>
                    </h1>
                    <Link to="/shop" className="inline-block bg-white text-black px-12 py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">
                        Shop Collection
                    </Link>
                </div>
            </section>

            {/* 2. CÁC NHÓM SẢN PHẨM */}
            {renderCategorySection("Áo Thun Basic", "danh mục")}

            {/* 3. EDITORIAL QUOTE BANNER */}
            <div className="bg-zinc-950 py-32 text-center relative">
                <div className="absolute inset-0 opacity-10 flex items-center justify-center overflow-hidden pointer-events-none">
                    <span className="text-[30vw] font-black text-white select-none italic">Q-LAB</span>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <p className="text-red-600 font-bold uppercase tracking-widest text-[10px] mb-6 tracking-[0.5em]">Vision</p>
                    <h3 className="text-white text-2xl md:text-5xl font-light italic leading-relaxed max-w-5xl mx-auto tracking-tight">
                        "Thời trang không chỉ là trang phục, <br/> đó là cách bạn khẳng định <span className="font-black not-italic text-red-600">Cái Tôi</span> tối giản."
                    </h3>
                </div>
            </div>

            {renderCategorySection("Quần Jeans & Khaki", "danh mục")}

            {/* 4. FOOTER BANNER (Khuyến khích đăng ký) */}
            <section className="container mx-auto px-4 py-20">
                <div className="bg-zinc-100 p-12 md:p-24 flex flex-col md:flex-row justify-between items-center gap-10">
                    <h4 className="text-4xl font-black uppercase tracking-tighter leading-none max-w-md">
                        Trở thành hội viên <br/> <span className="text-zinc-400">Nhận ưu đãi 15%.</span>
                    </h4>
                    <Link to="/register" className="bg-black text-white px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition-colors flex items-center gap-3">
                        Đăng ký ngay <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default HomeScreen;