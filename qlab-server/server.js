import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const server = express();
const API_PREFIX = '/api/v1';

// 1. Middleware giải mã JSON (Phải đặt trên cùng)
server.use(express.json());

// 2. Định nghĩa các Route
server.get('/', (req, res) => {
    res.send('API is running!');
});

// SỬA Ở ĐÂY: Dùng dấu huyền ` và đặt trước server.listen
server.use(`${API_PREFIX}/products`, productRoutes);

// 3. Cuối cùng mới cho Server lắng nghe
const port = process.env.PORT || 5000;
server.listen(port, () => {
    const mode = process.env.NODE_ENV || 'development';
    logger.info(`Server đang chạy ở chế độ ${mode} trên cổng ${port}`);
    logger.info(`Đã nạp Route: ${API_PREFIX}/products`);
});