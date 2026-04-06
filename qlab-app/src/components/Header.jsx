import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from "@/components/ui/button";

export default function Header() {
    const { user, logout } = useAuthStore();

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wider">
                    Q-LAB
                </Link>

                <nav>
                    {user ? (
                        <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Chào, <span className="font-bold text-black">{user.fullName}</span>
              </span>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin">
                                    <Button variant="outline" size="sm">Trang Quản Trị</Button>
                                </Link>
                            )}
                            <Button variant="destructive" size="sm" onClick={logout}>Đăng xuất</Button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login">
                                <Button variant="outline">Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Đăng ký</Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}