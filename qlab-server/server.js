import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const server = express();
const API_PREFIX = '/api/v1';

// --- MIDDLEWARE ---
// 1. CORS phải đặt TRÊN CÙNG để "mở cửa" cho Frontend trước khi xử lý route
server.use(cors());

// 2. Giải mã JSON
server.use(express.json());

// --- ROUTES ---
server.get('/', (req, res) => {
    res.send('API is running!');
});

// Chú ý: Route của bạn bây giờ là /api/v1/products
server.use(`${API_PREFIX}/products`, productRoutes);

// --- START SERVER ---
const port = process.env.PORT || 5000;
server.listen(port, () => {
    const mode = process.env.NODE_ENV || 'development';
    logger.info(`Server đang chạy ở chế độ ${mode} trên cổng ${port}`);
    logger.info(`Đã nạp Route: ${API_PREFIX}/products`);
});