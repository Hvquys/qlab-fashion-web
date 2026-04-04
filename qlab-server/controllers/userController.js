import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Thêm địa chỉ giao hàng mới
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const newAddress = {
            receiverName: req.body.receiverName,
            phone: req.body.phone,
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
            detail: req.body.detail,
            isDefault: req.body.isDefault || false
        };

        // Nếu đây là địa chỉ đầu tiên hoặc user set nó làm mặc định
        if (newAddress.isDefault || user.addresses.length === 0) {
            newAddress.isDefault = true;
            // Hủy mặc định của tất cả địa chỉ cũ
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Thêm địa chỉ thành công",
            data: user.addresses
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng');
    }
});

// @desc    Cập nhật địa chỉ giao hàng
// @route   PUT /api/v1/users/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Tìm địa chỉ cụ thể trong mảng (dùng .id() của Mongoose cho mảng nhúng)
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            res.status(404);
            throw new Error('Không tìm thấy địa chỉ này');
        }

        // Cập nhật thông tin
        address.receiverName = req.body.receiverName || address.receiverName;
        address.phone = req.body.phone || address.phone;
        address.province = req.body.province || address.province;
        address.district = req.body.district || address.district;
        address.ward = req.body.ward || address.ward;
        address.detail = req.body.detail || address.detail;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật địa chỉ thành công",
            data: user.addresses
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng');
    }
});

// @desc    Xóa địa chỉ giao hàng
// @route   DELETE /api/v1/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            res.status(404);
            throw new Error('Không tìm thấy địa chỉ này');
        }

        if (address.isDefault) {
            res.status(400);
            throw new Error('Không thể xóa địa chỉ mặc định. Vui lòng thiết lập địa chỉ khác làm mặc định trước.');
        }

        // Dùng pull để xóa object ra khỏi mảng
        user.addresses.pull(req.params.addressId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Xóa địa chỉ thành công",
            data: user.addresses
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng');
    }
});

// @desc    Đặt một địa chỉ làm mặc định
// @route   PUT /api/v1/users/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            res.status(404);
            throw new Error('Không tìm thấy địa chỉ này');
        }

        // Gỡ cờ mặc định của toàn bộ địa chỉ cũ
        user.addresses.forEach(addr => addr.isDefault = false);

        // Cài cờ mặc định cho địa chỉ mới
        address.isDefault = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật địa chỉ mặc định thành công",
            data: user.addresses
        });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng');
    }
});