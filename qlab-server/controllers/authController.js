import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/generateToken.js';

// @desc    Đăng ký user mới & trả về token
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Email này đã được đăng ký trong hệ thống');
    }

    const user = await User.create({ fullName, email, password });

    if (user) {
        const accessToken = generateTokens(res, user._id);
        res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: {
                user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role },
                accessToken
            }
        });
    } else {
        res.status(400);
        throw new Error('Dữ liệu đầu vào không hợp lệ');
    }
});

// @desc    Đăng nhập user & trả về token
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = generateTokens(res, user._id);

        // Lưu refresh token vào DB (Phục vụ việc Admin có thể revoke/thu hồi token nếu nghi ngờ bị hack)
        user.refreshToken = req.cookies.refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                user: { _id: user._id, fullName: user.fullName, role: user.role },
                accessToken
            }
        });
    } else {
        res.status(401);
        throw new Error('Email hoặc mật khẩu không chính xác');
    }
});

// @desc    Cấp lại Access Token mới dựa vào Refresh Token trong Cookie
// @route   POST /api/v1/auth/refresh-token
// @access  Public (Nhưng yêu cầu phải có Cookie)
export const refreshToken = asyncHandler(async (req, res) => {
    // Lấy refresh token từ HttpOnly Cookie
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401);
        throw new Error('Không tìm thấy Refresh Token, vui lòng đăng nhập lại');
    }

    try {
        // Giải mã Refresh Token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Kiểm tra xem User có tồn tại và token có khớp với DB không
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            res.status(403);
            throw new Error('Refresh Token không hợp lệ hoặc đã bị thu hồi');
        }

        // Cấp phát lại bộ Token mới (Bảo mật: JWT Rotation)
        const newAccessToken = generateTokens(res, user._id);
        user.refreshToken = req.cookies.refreshToken; // Cập nhật lại token mới vào DB
        await user.save();

        res.status(200).json({
            success: true,
            message: "Làm mới token thành công",
            data: { accessToken: newAccessToken }
        });
    } catch (error) {
        res.status(403);
        throw new Error('Refresh Token đã hết hạn, vui lòng đăng nhập lại');
    }
});

// @desc    Đăng xuất (Xóa Cookie & Xóa Token trong DB)
// @route   POST /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.refreshToken = null; // Xóa token trong DB
        await user.save();
    }

    // Xóa cookie trên trình duyệt
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
});