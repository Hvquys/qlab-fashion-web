import mongoose from 'mongoose';
import logger from '../utils/logger.js'; // Đảm bảo đường dẫn này đúng với cấu trúc thư mục của bạn

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Sử dụng logger.success thay cho .cyan.underline
        logger.success(`MongoDB đã kết nối`);

    } catch (err) {
        // Sử dụng logger.error thay cho .red.bold
        logger.error(`Lỗi kết nối MongoDB: ${err.message}`);

        // Thoát tiến trình với mã lỗi 1 nếu không kết nối được DB
        process.exit(1);
    }
}

export default connectDB;