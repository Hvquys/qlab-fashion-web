import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: (data) => axiosClient.post('/auth/register', data),
        onSuccess: () => {
            toast.success('Đăng ký thành công!');
            setTimeout(() => navigate('/login'), 1500);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Đăng ký thất bại!');
        }
    });

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Toaster />
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Tạo tài khoản</CardTitle>
                    <CardDescription className="text-center">
                        Điền thông tin bên dưới để đăng ký thành viên
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Họ và Tên</Label>
                            <Input id="fullName" {...register('fullName', { required: true })} placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email', { required: true })} placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input id="password" type="password" {...register('password', { required: true, minLength: 6 })} />
                        </div>
                        <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Đang tạo...' : 'Đăng ký'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}