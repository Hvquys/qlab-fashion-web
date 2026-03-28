import chalk from 'chalk';

const logger = {
    // Log thông tin bình thường (Xanh dương)
    info: (message) => {
        console.log(`${chalk.blue.bold('ℹ INFO:')} ${chalk.blue(message)}`);
    },

    // Log thành công (Xanh lá)
    success: (message) => {
        console.log(`${chalk.green.bold('✔ SUCCESS:')} ${chalk.green(message)}`);
    },

    // Log cảnh báo (Vàng)
    warn: (message) => {
        console.warn(`${chalk.yellow.bold('⚠ WARNING:')} ${chalk.yellow(message)}`);
    },

    // Log lỗi (Đỏ)
    error: (message, stack = '') => {
        console.error(`${chalk.red.bold('✖ ERROR:')} ${chalk.red(message)}`);
        if (stack) console.error(chalk.red.italic(stack));
    },

    // Log dành riêng cho Cloudinary (Màu Cyan - xanh lơ)
    upload: (url) => {
        console.log(
            chalk.bgCyan.black.bold(' CLOUDINARY ') +
            ` ${chalk.cyan('File uploaded at:')} ${chalk.cyan.underline(url)}`
        );
    }
};

export default logger;