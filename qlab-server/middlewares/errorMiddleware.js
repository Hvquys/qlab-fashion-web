// Bắt lỗi khi người dùng gọi sai URL (404 Not Found)
export const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy endpoint - ${req.originalUrl}`);
    res.status(404);
    next(error); // Đẩy lỗi xuống errorHandler
};

// Global Error Handler: Định dạng lại mọi lỗi trong hệ thống thành chuẩn JSON
export const errorHandler = (err, req, res, next) => {
    // Đôi khi lỗi xảy ra nhưng status code vẫn là 200, ta phải ép về 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Xử lý lỗi đặc thù của Mongoose (CastError) khi truyền sai định dạng ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Không tìm thấy tài nguyên (Sai định dạng ID)';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        // Chỉ hiển thị stack trace (dòng code gây lỗi) khi ở môi trường dev
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};