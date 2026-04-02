import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Trắng', hex: '#FFFFFF' },
    { name: 'Xám', hex: '#808080' },
    { name: 'Đỏ', hex: '#FF0000' }
];

const ShopScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // Filters & Sorting States
    const [selectedCats, setSelectedCats] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceLimit, setPriceLimit] = useState(3000000);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/v1/products');
                setProducts(data.products || data);
            } catch (err) { console.error("API Error:", err); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    // 1. Logic Lọc & Sắp xếp (Hợp nhất)
    const processedProducts = useMemo(() => {
        let result = products.filter(p => {
            const catMatch = selectedCats.length === 0 || selectedCats.includes(p.category);
            const sizeMatch = selectedSizes.length === 0 || p.sizes?.some(s => selectedSizes.includes(s));
            const colorMatch = selectedColors.length === 0 || selectedColors.includes(p.color);
            return catMatch && sizeMatch && colorMatch && p.price <= priceLimit;
        });

        if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return result;
    }, [products, selectedCats, selectedSizes, selectedColors, priceLimit, sortBy]);

    // 2. Logic Phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentItems = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    const toggleFilter = (item, state, setState) => {
        setCurrentPage(1); // Reset trang khi lọc
        setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
    };

    const FilterSection = () => (
        <div className="space-y-10 py-2">
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Danh mục</h4>
                <div className="flex flex-col gap-3">
                    {['Áo', 'Quần', 'Phụ kiện', 'Giày'].map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCats.includes(cat)}
                                onChange={() => toggleFilter(cat, selectedCats, setSelectedCats)}
                                className="w-4 h-4 border-zinc-300 rounded text-black focus:ring-black"
                            />
                            <span className={`text-xs uppercase tracking-wider ${selectedCats.includes(cat) ? 'font-bold text-black' : 'text-zinc-500 group-hover:text-black'}`}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Kích cỡ</h4>
                <div className="grid grid-cols-4 gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                            className={`py-2 text-[10px] font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-400 hover:border-black'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Màu sắc</h4>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map(color => (
                        <button
                            key={color.name}
                            onClick={() => toggleFilter(color.name, selectedColors, setSelectedColors)}
                            className={`w-6 h-6 rounded-full border border-zinc-200 p-0.5 transition-transform hover:scale-110 ${selectedColors.includes(color.name) ? 'ring-2 ring-black ring-offset-2' : ''}`}
                        >
                            <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Giá tối đa</h4>
                    <span className="text-xs font-bold font-mono">{priceLimit.toLocaleString()}đ</span>
                </div>
                <input
                    type="range" min="0" max="5000000" step="100000"
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="w-full h-[2px] bg-zinc-200 appearance-none accent-black cursor-pointer"
                />
            </div>
        </div>
    );

    return (
        <main className="bg-white min-h-screen">
            {/* Breadcrumbs & Header */}
            <div className="border-b border-zinc-100">
                <div className="container mx-auto px-4 py-12 text-center">
                    <nav className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4 italic">Home / Shop / All Products</nav>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Cửa hàng<span className="text-red-600">.</span></h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Desktop Toolbar */}
                <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
                    <button
                        onClick={() => setShowMobileFilter(true)}
                        className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2"
                    >
                        Bộ lọc ({selectedCats.length + selectedSizes.length + selectedColors.length})
                    </button>

                    <div className="hidden lg:block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, processedProducts.length)} trong {processedProducts.length} sản phẩm
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sắp xếp:</span>
                        <select
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-[11px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                            <option value="price_desc">Giá: Cao đến Thấp</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-16">
                    {/* Side Filter Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit">
                        <FilterSection />
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-sm" />)}
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                                    {currentItems.map(p => <ProductCard key={p._id} product={p} />)}
                                </div>

                                {/* Pagination Component */}
                                <div className="mt-20 flex justify-center items-center gap-4">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className={`w-10 h-10 text-[11px] font-bold transition-all border ${currentPage === i + 1 ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-400 hover:border-black'}`}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-40 text-center border border-dashed border-zinc-200 rounded-lg">
                                <p className="text-zinc-400 text-sm uppercase tracking-widest">Không tìm thấy sản phẩm nào phù hợp.</p>
                                <button onClick={() => {setSelectedCats([]); setPriceLimit(3000000);}} className="mt-4 text-xs font-black underline uppercase">Xóa bộ lọc</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay (Drawer) */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${showMobileFilter ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
                <div className={`absolute bottom-0 w-full bg-white rounded-t-[2.5rem] p-10 transition-transform duration-500 ${showMobileFilter ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-8" />
                    <FilterSection />
                    <button
                        onClick={() => setShowMobileFilter(false)}
                        className="w-full mt-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl"
                    >
                        Xem kết quả ({processedProducts.length})
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ShopScreen;