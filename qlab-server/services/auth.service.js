const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_SECRET, REFRESH_EXPIRES_IN } = process.env;

// Hàm tiện ích tạo token
const generateTokens = (userId, role) => {
    const accessToken = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: userId, role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
};

exports.register = async (userData) => {
    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error('Email đã được sử dụng!');

    const newUser = await User.create(userData);
    return generateTokens(newUser._id, newUser.role);
};

exports.login = async (email, password) => {
    // Cần thêm select('+password') vì trong model đã cấu hình select: false
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Email hoặc mật khẩu không chính xác!');

    // Sử dụng method comparePassword đã định nghĩa ở User Model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Email hoặc mật khẩu không chính xác!');

    const tokens = generateTokens(user._id, user.role);

    // Lưu refresh token vào DB để xoay vòng/thu hồi sau này
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        tokens
    };
};