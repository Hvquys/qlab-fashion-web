import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Ruler, Star, Truck, RotateCcw, Plus, Minus, ChevronRight, CheckCircle2, Info, Wind, Zap } from 'lucide-react';

const ProductScreen = () => {
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState('M');
    const [qty, setQty] = useState(1);

    // Giả lập Dữ liệu đầy đủ (Full Schema)
    const product = {
        name: "Q-LAB DECONSTRUCTED TEE v.0.1",
        price: 1250000,
        category: "LAB_ARCHIVE",
        mainImage: "https://via.placeholder.com/800x1000",
        lookbookImages: [
            "https://via.placeholder.com/800x500",
            "https://via.placeholder.com/500x700"
        ],
        description: "Sản phẩm nằm trong dự án nghiên cứu cấu trúc may mặc hiện đại, loại bỏ các đường may truyền thống và thay thế bằng kỹ thuật ghép nối công nghiệp.",
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans selection:bg-red-600 selection:text-white">

            {/* --- PHẦN 1: MUA HÀNG (CONVERSION) --- */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-16">
                {/* Gallery */}
                <div className="w-full lg:w-3/5 space-y-4">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">
                        <Link to="/">Home</Link> <ChevronRight size={10}/> <span>{product.category}</span>
                    </nav>
                    <div className="bg-zinc-100 aspect-[3/4] overflow-hidden border border-zinc-100">
                        <img src={product.mainImage} className="w-full h-full object-cover" alt="Main View" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-[3/4] bg-zinc-50 border border-zinc-100 cursor-pointer">
                                <img src={product.mainImage} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-all" alt="Detail" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Purchase Info */}
                <div className="w-full lg:w-2/5 py-6 flex flex-col justify-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">{product.name}</h1>
                        <div className="flex items-center gap-6">
                            <span className="text-4xl font-black text-red-600 italic">{product.price.toLocaleString()}đ</span>
                            <div className="flex items-center gap-1 px-3 py-1 bg-zinc-100 text-[10px] font-black italic border-l-4 border-black">
                                <Star size={12} fill="black" /> 5.0 / VERIFIED
                            </div>
                        </div>

                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-tight leading-relaxed border-l-2 border-zinc-200 pl-4 italic">
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div className="pt-8 space-y-4">
                            <div className="flex justify-between font-black text-[11px] uppercase tracking-widest">
                                <span>Chọn Kích Cỡ: {selectedSize}</span>
                                <button className="flex items-center gap-2 underline text-zinc-400 hover:text-black"><Ruler size={14}/> Bảng Size</button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button key={size} onClick={() => setSelectedSize(size)} className={`py-5 border-2 font-black transition-all ${selectedSize === size ? 'bg-black text-white border-black shadow-2xl scale-105' : 'border-zinc-100 hover:border-black'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 pt-6">
                            <button className="w-full bg-black text-white py-6 font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all shadow-xl">
                                <ShoppingBag size={20} /> Thêm vào túi đồ
                            </button>
                        </div>

                        {/* Quick Benefits */}
                        <div className="pt-8 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter text-zinc-400">
                                <Truck size={20} className="text-black"/> Miễn phí giao hàng &gt; 2M
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter text-zinc-400">
                                <RotateCcw size={20} className="text-black"/> Đổi trả 07 ngày
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHẦN 2: BÀI VIẾT CHI TIẾT (RICH EDITORIAL CONTENT) --- */}
            <section className="bg-[#fafafa] py-24 mt-20 border-y border-zinc-100">
                <div className="max-w-4xl mx-auto px-4 space-y-24">

                    {/* Section Story */}
                    <div className="text-center space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Design_Logic<span className="text-red-600">.</span></h2>
                        <p className="text-zinc-600 text-lg md:text-xl font-medium leading-relaxed italic">
                            Mỗi sản phẩm tại Q-LAB là một bản báo cáo về chất liệu. Chúng tôi không chỉ may áo, chúng tôi kiến tạo cấu trúc bảo vệ cơ thể trong môi trường đô thị.
                        </p>
                    </div>

                    {/* Mixed Content: Image + Text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b-4 border-black inline-block pb-2">01. Cấu Trúc Vải</h3>
                            <p className="text-sm font-bold uppercase text-zinc-500 leading-loose">
                                Sử dụng dòng vải 100% Cotton định lượng 320 GSM. Bề mặt vải được xử lý qua công nghệ <span className="text-black">Carbon Brush</span> để tạo độ mịn màng tuyệt đối nhưng vẫn giữ được độ đanh cứng của form dáng Boxy.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="bg-white p-4 border border-zinc-200 flex-1"><Wind size={24}/><p className="mt-2 text-[9px] font-black uppercase">Thoáng khí</p></div>
                                <div className="bg-white p-4 border border-zinc-200 flex-1"><Zap size={24}/><p className="mt-2 text-[9px] font-black uppercase">Chống nhăn</p></div>
                            </div>
                        </div>
                        <div className="aspect-square bg-zinc-200 overflow-hidden shadow-2xl">
                            <img src={product.lookbookImages[1]} className="w-full h-full object-cover" alt="Detail Zoom" />
                        </div>
                    </div>

                    {/* Section: Technical Table */}
                    <div className="space-y-10">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Bảng Thông Số Kỹ Thuật (Specs)</h3>
                        <div className="border border-black overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-left text-xs md:text-sm uppercase font-bold">
                                <tbody>
                                <tr className="border-b border-zinc-100 hover:bg-zinc-50">
                                    <td className="p-6 bg-zinc-50 w-1/3 border-r border-zinc-100">Chất liệu chính</td>
                                    <td className="p-6">100% Premium Combed Cotton</td>
                                </tr>
                                <tr className="border-b border-zinc-100 hover:bg-zinc-50">
                                    <td className="p-6 bg-zinc-50 border-r border-zinc-100">Định lượng vải</td>
                                    <td className="p-6">320 GSM (Heavyweight Fabric)</td>
                                </tr>
                                <tr className="border-b border-zinc-100 hover:bg-zinc-50">
                                    <td className="p-6 bg-zinc-50 border-r border-zinc-100">Công nghệ nhuộm</td>
                                    <td className="p-6">Reactive Dye (Giữ màu bền bỉ)</td>
                                </tr>
                                <tr className="border-b border-zinc-100 hover:bg-zinc-50">
                                    <td className="p-6 bg-zinc-50 border-r border-zinc-100">Đường may</td>
                                    <td className="p-6">Chain-Stitch (Móc xích 3 kim)</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section: Size Chart */}
                    <div className="space-y-10">
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Bảng Số Đo (cm)</h3>
                            <span className="text-[10px] font-bold text-zinc-400 italic">*Sai số cho phép +/- 1cm</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 border border-black text-center divide-y md:divide-y-0 md:divide-x divide-black bg-white">
                            <div className="p-8"><p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Kích Cỡ</p><p className="text-xl font-black italic">S</p></div>
                            <div className="p-8"><p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Dài Áo</p><p className="text-xl font-black italic">68</p></div>
                            <div className="p-8"><p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Rộng Áo</p><p className="text-xl font-black italic">58</p></div>
                            <div className="p-8"><p className="text-[10px] font-black text-zinc-400 mb-2 uppercase">Dài Tay</p><p className="text-xl font-black italic">22</p></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHẦN 3: ĐÁNH GIÁ VÀ HƯỚNG DẪN BẢO QUẢN --- */}
            <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row gap-20">
                <div className="md:w-1/2 space-y-8">
                    <h4 className="text-4xl font-black uppercase italic tracking-tighter">Feedback<span className="text-red-600">.</span></h4>
                    <div className="space-y-6">
                        {[1,2].map(i => (
                            <div key={i} className="bg-zinc-50 p-8 border-l-4 border-black space-y-4">
                                <div className="flex gap-1"><Star size={12} fill="black" /><Star size={12} fill="black" /><Star size={12} fill="black" /><Star size={12} fill="black" /><Star size={12} fill="black" /></div>
                                <p className="text-sm font-bold uppercase italic tracking-tight">"Sản phẩm quá chất lượng so với tầm giá. Form áo cực kỳ đẹp và dày dặn."</p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase">Khách hàng: Nguyễn Văn A - Verified Buyer</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:w-1/2 space-y-8">
                    <h4 className="text-4xl font-black uppercase italic tracking-tighter">Product_Care<span className="text-red-600">.</span></h4>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { title: 'Giặt máy', desc: 'Sử dụng nước lạnh, lộn trái áo khi giặt.' },
                            { title: 'Chế độ phơi', desc: 'Phơi trong bóng râm, tránh ánh nắng trực tiếp.' },
                            { title: 'Ủi (Là)', desc: 'Sử dụng nhiệt độ thấp, ủi ở mặt trái.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 items-start border-b border-zinc-100 pb-4">
                                <span className="text-xl font-black italic text-zinc-200">0{idx+1}</span>
                                <div>
                                    <h5 className="font-black text-xs uppercase mb-1">{item.title}</h5>
                                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PHẦN 4: SẢN PHẨM LIÊN QUAN (RELATED SUBJECTS) --- */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-24 border-t border-zinc-100">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Recommendation_System</span>
                        <h4 className="text-4xl font-black uppercase italic tracking-tighter italic">Related_Subjects<span className="text-zinc-200">/</span></h4>
                    </div>
                    <Link to="/shop" className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all">
                        Xem tất cả
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
                    {[
                        { id: 1, name: "LAB_CARGO_PANTS_v1", price: "1.850.000", img: "https://via.placeholder.com/500x700" },
                        { id: 2, name: "UTILITY_VEST_BLACK", price: "2.100.000", img: "https://via.placeholder.com/500x700" },
                        { id: 3, name: "DECONSTRUCTED_HOODIE", price: "2.850.000", img: "https://via.placeholder.com/500x700" },
                        { id: 4, name: "MINIMAL_LAB_CAP", price: "550.000", img: "https://via.placeholder.com/500x700" }
                    ].map((item) => (
                        <Link key={item.id} to={`/product/${item.id}`} className="group space-y-4">
                            {/* Image Container with Hover Effect */}
                            <div className="aspect-[3/4] bg-zinc-100 overflow-hidden relative border border-zinc-100">
                                <img
                                    src={item.img}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    alt={item.name}
                                />
                                {/* Overlay Tag */}
                                <div className="absolute top-4 right-4 bg-black text-white text-[8px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    VIEW_DETAILS
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-[11px] font-black uppercase tracking-tighter leading-tight w-2/3">
                                        {item.name}
                                    </h5>
                                    <span className="text-[11px] font-black italic text-red-600">
                    {item.price}đ
                  </span>
                                </div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Q-LAB / NEW_ARCHIVE</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default ProductScreen;