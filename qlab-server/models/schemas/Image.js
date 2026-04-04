import mongoose from 'mongoose';

export const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true } // Dùng để xóa ảnh trên Cloudinary
}, { _id: false });