import multer from 'multer';

// Lưu file vào bộ nhớ đệm (RAM) thay vì lưu ra ổ cứng server
const storage = multer.memoryStorage();

// Bộ lọc: Chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép định dạng hình ảnh!'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn ảnh tối đa 5MB
});