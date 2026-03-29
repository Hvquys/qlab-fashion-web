import React from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10 border-t border-zinc-900">
            <div className="container mx-auto px-6">
                {/* --- PHẦN CHÍNH: GRID 4 CỘT --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* CỘT 1: THƯƠNG HIỆU & KẾT NỐI (BRANDING) */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter italic">
                            Q-LAB<span className="text-red-600">.</span>
                        </h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed max-w-[240px] uppercase tracking-tight">
                            Định nghĩa lại phong cách tối giản cho thế hệ mới. <br />
                            <span className="text-zinc-400 italic">Quality. Timeless. Lab-tested.</span>
                        </p>

                        {/* Social Links dùng Chữ (Đúng chất Lab/Minimalist) */}
                        <div className="flex gap-6 items-center text-[10px] font-black tracking-[0.2em] text-zinc-500">
                            <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-red-600 pb-1">INSTA</a>
                            <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-red-600 pb-1">FACE</a>
                            <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-red-600 pb-1">TWIT</a>
                        </div>
                    </div>

                    {/* CỘT 2: DANH MỤC MUA SẮM (SHOPPING) */}
                    <div>
                        <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] mb-8 text-zinc-400">Mua sắm</h4>
                        <ul className="space-y-4 text-[13px] text-zinc-500 font-medium">
                            <li><a href="#" className="hover:text-white transition-all flex items-center group">
                                <ArrowRight className="w-0 h-3 group-hover:w-4 transition-all opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 text-red-600" />
                                Tất cả sản phẩm
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-all flex items-center group">
                                <ArrowRight className="w-0 h-3 group-hover:w-4 transition-all opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 text-red-600" />
                                Đồ nam (Menswear)
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-all flex items-center group">
                                <ArrowRight className="w-0 h-3 group-hover:w-4 transition-all opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 text-red-600" />
                                Đồ nữ (Womenswear)
                            </a></li>
                            <li><a href="#" className="hover:text-white transition-all flex items-center group">
                                <ArrowRight className="w-0 h-3 group-hover:w-4 transition-all opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 text-red-600" />
                                Phụ kiện (Access)
                            </a></li>
                        </ul>
                    </div>

                    {/* CỘT 3: THÔNG TIN LIÊN HỆ (CONTACT) */}
                    <div>
                        <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] mb-8 text-zinc-400">Liên hệ hỗ trợ</h4>
                        <ul className="space-y-5 text-[13px] text-zinc-500 font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 shrink-0 text-zinc-400" />
                                <span className="leading-snug">123 Lab Street, District 1, Ho Chi Minh City, VN</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 shrink-0 text-zinc-400" />
                                <span>+84 123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 shrink-0 text-zinc-400" />
                                <span className="border-b border-zinc-800 pb-0.5 hover:text-white transition cursor-pointer">contact@qlab.fashion</span>
                            </li>
                        </ul>
                    </div>

                    {/* CỘT 4: ĐĂNG KÝ NHẬN TIN (NEWSLETTER) */}
                    <div>
                        <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] mb-8 text-zinc-400">Đăng ký nhận tin</h4>
                        <p className="text-[13px] text-zinc-500 mb-6 leading-relaxed">Nhận thông báo sớm nhất về các đợt Drop hàng & Sale Off.</p>

                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Email của bạn..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-none py-3 px-4 text-[13px] outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                            />
                            <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-zinc-800 hover:bg-red-600 transition-colors group-focus-within:bg-red-600">
                                <Send size={16} className="text-white" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- PHẦN DƯỚI CÙNG (BOTTOM BAR) --- */}
                <div className="mt-24 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Bản quyền */}
                    <div className="text-[10px] text-zinc-600 tracking-[0.3em] font-medium uppercase text-center md:text-left leading-loose">
                        © 2026 Q-LAB FASHION VN. <br className="md:hidden" /> ALL RIGHTS RESERVED.
                    </div>

                    {/* Phương thức thanh toán (Dạng chữ - Cực Pro) */}
                    <div className="flex gap-6 items-center grayscale opacity-30 hover:opacity-100 transition-all">
                        <span className="text-[10px] font-black tracking-widest text-zinc-400">VISA</span>
                        <span className="text-[10px] font-black tracking-widest text-zinc-400">MASTERCARD</span>
                        <span className="text-[10px] font-black tracking-widest text-zinc-400">MOMO</span>
                        <span className="text-[10px] font-black tracking-widest text-zinc-400">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;