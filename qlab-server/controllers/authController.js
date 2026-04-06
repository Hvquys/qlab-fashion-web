import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Hàm Helper tạo bộ đôi Token
const generateTokens = (userId) => {
    // Access Token sống ngắn hạn (ví dụ: 15 phút)
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );

    // Refresh Token sống dài hạn (ví dụ: 7 ngày)
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/v1/auth/register
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // 1. Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
        }

        // 2. Tạo User mới (Mongoose sẽ tự lo các trường default và mã hóa password)
        const user = await User.create({
            fullName,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// @desc    Đăng nhập
// @route   POST /api/v1/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user theo email
        const user = await User.findOne({ email });

        // 2. Kiểm tra user có tồn tại và password có khớp không
        if (user && (await user.matchPassword(password))) {

            // 3. Tạo Tokens
            const { accessToken, refreshToken } = generateTokens(user._id);

            // 4. Lưu refreshToken vào Database (để quản lý phiên, cho phép Admin thu hồi nếu cần)
            user.refreshToken = refreshToken;
            await user.save();

            // 5. Gắn Refresh Token vào HttpOnly Cookie (Bảo mật chống XSS)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Chỉ bật secure (HTTPS) khi lên Production
                sameSite: 'strict', // Chống tấn công CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
            });

            // 6. Trả Access Token và thông tin User về cho Frontend (Tuyệt đối không trả password)
            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role
                    },
                    accessToken
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};