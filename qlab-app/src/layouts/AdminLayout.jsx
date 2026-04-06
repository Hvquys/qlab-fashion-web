import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
    const { user, logout } = useAuthStore();

    // BẢO VỆ ROUTE: Phải đăng nhập và có role ADMIN mới được vào
    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-center">Q-LAB ADMIN</h2>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li><Link to="/admin" className="block p-2 rounded hover:bg-gray-800">Dashboard</Link></li>
                        <li><Link to="/admin/products" className="block p-2 rounded hover:bg-gray-800">Sản phẩm</Link></li>
                        <li><Link to="/admin/orders" className="block p-2 rounded hover:bg-gray-800">Đơn hàng</Link></li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="w-full bg-red-600 p-2 rounded hover:bg-red-700">Đăng xuất</button>
                </div>
            </aside>

            {/* NỘI DUNG CHÍNH BÊN PHẢI */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}