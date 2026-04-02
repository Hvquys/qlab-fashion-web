import User from '../models/user.Model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Đăng nhập người dùng & trả về token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });

    // Kiểm tra user có tồn tại và mật khẩu có khớp không (dùng hàm matchPassword đã viết ở Model)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id), // Cấp token
        });
    } else {
        res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
    }
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra email đã được sử dụng chưa
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'Tài khoản (Email) đã tồn tại' });
        return;
    }

    // Tạo user mới
    const user = await User.create({
        name,
        email,
        password, // Sẽ được tự động mã hóa nhờ pre('save') trong Model
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
    }
};