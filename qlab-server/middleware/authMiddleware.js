import jwt from 'jsonwebtoken';
import User from '../models/user.Model.js';

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem token có được gửi kèm trong Header không (dạng Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Lấy chuỗi token sau chữ 'Bearer'

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin user từ ID trong token và gán vào biến req.user (không lấy password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp
        } catch (error) {
            res.status(401).json({ message: 'Không có quyền truy cập, token lỗi' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });
    }
};

// Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Chỉ dành cho quản trị viên (Admin)' });
    }
};

export { protect, admin };