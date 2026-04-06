import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },

    // Lưu thẳng 1 địa chỉ duy nhất
    address: {
        receiverName: { type: String },
        phone: { type: String },
        province: { type: String },
        district: { type: String },
        ward: { type: String },
        detail: { type: String }
    },

    refreshToken: { type: String, default: null }
}, { timestamps: true });

// Tự động băm mật khẩu trước khi lưu (Chuẩn Mongoose 6+ dùng async/await)
userSchema.pre('save', async function () {
    // Nếu password không bị thay đổi, chỉ return để thoát hàm, tuyệt đối KHÔNG dùng next()
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Hàm custom: So sánh mật khẩu người dùng nhập vào với mật khẩu băm trong DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);