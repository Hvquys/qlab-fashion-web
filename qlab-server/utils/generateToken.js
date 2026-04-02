import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // Tạo token với payload là id của user, hạn sử dụng 30 ngày
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export default generateToken;