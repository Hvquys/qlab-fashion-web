import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

const queryClient = new QueryClient();

// Các Component giả lập (Placeholder) để bạn thấy Route hoạt động
const HomePage = () => <div className="text-2xl">Trang chủ: Danh sách sản phẩm sẽ nằm ở đây</div>;
const AdminDashboard = () => <div className="text-2xl">Thống kê doanh thu Admin</div>;

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* KHU VỰC KHÔNG CẦN LAYOUT (Chỉ chứa form) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* KHU VỰC GIAO DIỆN USER (Dùng chung UserLayout) */}
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<HomePage />} /> {/* Route mặc định khi vào "/" */}
                        {/* Thêm route /cart, /checkout vào đây sau */}
                    </Route>

                    {/* KHU VỰC GIAO DIỆN ADMIN (Dùng chung AdminLayout) */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} /> {/* Route mặc định khi vào "/admin" */}
                        {/* Thêm route /admin/products, /admin/orders vào đây sau */}
                    </Route>

                    {/* Bắt lỗi 404 - Đường dẫn không tồn tại */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;