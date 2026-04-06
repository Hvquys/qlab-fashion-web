import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

// Import các UI Component của Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const setLogin = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: (data) => axiosClient.post('/auth/login', data),
        onSuccess: (res) => {
            const { user, accessToken } = res.data.data;
            setLogin(user, accessToken);
            toast.success(`Chào mừng ${user.fullName}!`);
            setTimeout(() => navigate('/'), 1000); // Đẩy về trang chủ
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại!');
        }
    });

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Toaster />
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                    <CardDescription className="text-center">
                        Nhập email và mật khẩu của bạn để vào Q-LAB
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email', { required: true })} placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input id="password" type="password" {...register('password', { required: true })} />
                        </div>
                        <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}