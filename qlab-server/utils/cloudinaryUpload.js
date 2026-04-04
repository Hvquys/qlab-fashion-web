import cloudinary from '../config/cloudinary.js';

export const uploadStream = (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: `qlab/${folderName}` },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        // Kết thúc stream bằng cách đẩy buffer của file vào
        stream.end(fileBuffer);
    });
};