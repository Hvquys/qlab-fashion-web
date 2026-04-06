import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo app và kết nối DB
const app = express();
connectDB();

// 1. GLOBAL MIDDLEWARES
app.use(helmet()); // Bảo mật HTTP Header
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Đọc JSON từ body
app.use(express.urlencoded({ extended: true })); // Đọc form data
app.use(cookieParser()); // Đọc cookie

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Ghi log request ra console khi code
}

// 2. MOUNT ROUTES
app.get('/api/v1', (req, res) => {
    res.json({ message: "Welcome to Q-LAB API" });
});

// Chỗ này sau này ta sẽ cắm các routes: app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// 3. ERROR HANDLERS (Bắt buộc để ở cuối cùng)
app.use(notFound);
app.use(errorHandler);

// 4. KHỞI ĐỘNG SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});