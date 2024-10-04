const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
const moment = require('moment-timezone');
const db = require('./config')
// const express = require("express");

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  // Convert the timestamp to IST
  const istTimestamp = moment(timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  return `${istTimestamp} ${level}: ${message}`;
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    // new winston.transports.Console({ format: winston.format.simple() }) // Always log errors to console
  ],
});

const successLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'success.log' }),
    // new winston.transports.Console({ format: winston.format.simple() }) // Always log successes to console
  ],
});



module.exports = { errorLogger, successLogger };