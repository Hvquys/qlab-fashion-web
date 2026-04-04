import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// 1. Middleware kiểm tra đăng nhập (Bảo vệ Route)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Kiểm tra header Authorization có chứa chuỗi 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tách lấy token (Bỏ chữ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token bằng Secret Key
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // Tìm user trong DB dựa vào userId lưu trong token, và gán vào req.user
            // Dùng .select('-password') để loại bỏ field password khỏi kết quả trả về
            req.user = await User.findById(decoded.userId).select('-password');

            next(); // Vượt qua trạm kiểm soát, cho phép đi tiếp vào Controller
        } catch (error) {
            res.status(401);
            throw new Error('Không có quyền truy cập: Token không hợp lệ hoặc đã hết hạn');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Không có quyền truy cập: Không tìm thấy Token');
    }
});

// 2. Middleware phân quyền Admin (Chỉ dùng cho các route của quản trị)
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next(); // Hợp lệ là Admin, cho đi tiếp
    } else {
        res.status(403); // 403 Forbidden: Cấm truy cập
        throw new Error('Truy cập bị từ chối: Yêu cầu quyền Quản trị viên (Admin)');
    }
};