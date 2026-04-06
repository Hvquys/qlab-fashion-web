import User from '../models/User.js';

// @desc    Lấy thông tin cá nhân (Profile & Address)
// @route   GET /api/v1/users/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cập nhật địa chỉ giao hàng
// @route   PUT /api/v1/users/address
export const updateAddress = async (req, res) => {
    try {
        // req.body sẽ chứa thông tin: { receiverName, phone, province, district, ward, detail }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { address: req.body } }, // Ghi đè object address cũ bằng cái mới
            { new: true, runValidators: true } // Trả về data mới và chạy validate
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Đã cập nhật địa chỉ giao hàng',
            data: user.address
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};