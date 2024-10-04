// src/logger.js
const winston = require('winston');

const successLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'success.log' }),
    ],
});

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
    ],
});

module.exports = { successLogger, errorLogger };
