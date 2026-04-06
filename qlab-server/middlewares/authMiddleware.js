import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Kiểm tra User đã đăng nhập chưa
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Lấy token từ header

            // Giải mã token để lấy ID user
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // Tìm user trong DB và loại bỏ trường password không trả về
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập!' });
    }
};

// Kiểm tra User có phải Admin không
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Truy cập bị từ chối! Yêu cầu quyền Admin.' });
    }
};