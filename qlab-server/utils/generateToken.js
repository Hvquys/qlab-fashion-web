import jwt from 'jsonwebtoken';

export const generateTokens = (res, userId) => {
    // 1. Tạo Access Token (Sống ngắn: 15 phút)
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
    });

    // 2. Tạo Refresh Token (Sống lâu: 7 ngày)
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });

    // 3. Gắn Refresh Token vào HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Trình duyệt không thể đọc bằng JavaScript (Chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trên production
        sameSite: 'strict', // Chống tấn công CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return accessToken;
};