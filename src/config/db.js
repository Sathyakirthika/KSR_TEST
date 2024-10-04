const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const { errorLogger, successLogger }= require('../logger.js');

// MySQL connection setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        errorLogger.error(`Error connecting to the database: ${err.stack || err.message}`);
        return;
    }
    console.log('Connected to the MySQL database.');
    successLogger.info('Connected to the database')
});

// Export the MySQL connection directly
module.exports = connection; // Change this line
