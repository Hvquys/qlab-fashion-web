import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { imageSchema } from './schemas/Image.js';

const addressSchema = new mongoose.Schema({
    receiverName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    detail: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    password: { type: String, required: true },
    avatar: imageSchema,
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    addresses: [addressSchema], // Double Embedding
    refreshToken: { type: String, default: null }
}, { timestamps: true });

// Tự động băm mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);