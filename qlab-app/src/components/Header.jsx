import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronRight } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">

            {/* --- TẦNG 1: CHỨA LOGO & CÁC ICON CHÍNH --- */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">

                {/* TRÁI: Menu Hamburger (Mobile) */}
                <div className="flex items-center lg:hidden flex-1">
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* GIỮA: Logo */}
                <div className="flex-none lg:flex-1 lg:text-left">
                    <a href="/" className="text-2xl font-black italic tracking-tighter">
                        Q-LAB<span className="text-red-600">.</span>
                    </a>
                </div>

                {/* GIỮA (Desktop): Menu danh mục */}
                <nav className="hidden lg:flex flex-[2] justify-center gap-10">
                    {['Trang chủ', 'Sản phẩm', 'Bộ sưu tập'].map((item) => (
                        <a key={item} href="#" className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-red-600 transition">
                            {item}
                        </a>
                    ))}
                </nav>

                {/* PHẢI: Cart & Account (Account nằm ngoài cùng bên phải) */}
                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                    {/* Giỏ hàng */}
                    <a href="/cart" className="p-2 relative group hover:bg-gray-50 rounded-full transition">
                        <ShoppingBag className="w-5 h-5 md:w-6 h-6 group-hover:text-red-600 transition" />
                        <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
                    </a>

                    {/* Tài khoản (Nằm bên phải cùng) */}
                    <a href="/profile" className="p-2 hover:bg-gray-50 rounded-full transition hover:text-red-600">
                        <User className="w-5 h-5 md:w-6 h-6" />
                    </a>
                </div>
            </div>

            {/* --- TẦNG 2: THANH TÌM KIẾM (Chiếm trọn bề ngang) --- */}
            <div className="px-4 pb-4 md:pb-6 max-w-4xl mx-auto">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Bạn cần tìm gì hôm nay?..."
                        className="w-full bg-gray-100 border-2 border-transparent focus:border-black focus:bg-white py-2.5 pl-11 pr-4 rounded-xl text-sm transition-all outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
            </div>

            {/* --- SIDEBAR MOBILE --- */}
            <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />
                <aside className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="font-black italic text-xl">Q-LAB.</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:rotate-90 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 flex flex-col h-[calc(100%-80px)] justify-between">
                        {/* Nav Links chính */}
                        <nav className="flex flex-col gap-6">
                            {['Trang chủ', 'Cửa hàng', 'Bộ sưu tập'].map(item => (
                                <a key={item} href="#" className="flex justify-between items-center text-sm font-bold uppercase tracking-widest hover:text-red-600 transition group">
                                    {item} <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-600" />
                                </a>
                            ))}
                        </nav>

                        {/* Các nút Account & Cart cũng có trong Sidebar (Dưới cùng) */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <a href="/profile" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition">
                                <User className="w-5 h-5" /> Tài khoản của tôi
                            </a>
                            <a href="/cart" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition">
                                <ShoppingBag className="w-5 h-5" /> Giỏ hàng (0)
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </header>
    );
};

export default Header;