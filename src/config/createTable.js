const db = require('./db'); // Import MySQL connection

const { errorLogger, successLogger } = require('../logger.js'); // Import your logger

const CreateStorageTank_Table_Data = `
CREATE TABLE IF NOT EXISTS storagetank_Table ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    tankname VARCHAR(50) UNIQUE NOT NULL,
    tankradius DECIMAL(5,2) NOT NULL,
    tankcapacity DECIMAL(10,2) NOT NULL
);
`;

const CreateStock_Table_Data = `
CREATE TABLE IF NOT EXISTS stock_Table(
  id INT AUTO_INCREMENT PRIMARY KEY,
  tankname VARCHAR(50) UNIQUE,
  oilname VARCHAR(50),
  currentquantity DECIMAL(10,2),
  updatedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  materialtype VARCHAR(50) NULL 
);
`;


async function initializeDatabase() {
    try {
        // Create storagetank_Table table
        await db.promise().query(CreateStorageTank_Table_Data);
        successLogger.info("Table 'storagetank_Table' created successfully");
      
        // Create stock_Table table
        await db.promise().query(CreateStock_Table_Data);
        successLogger.info("Table 'Stock_Table' created successfully");
       
    } catch (err) {
        console.error("Error during table creation:", err);
        errorLogger.error("Error during table creation: " + err.message);
        
    }
}

module.exports = initializeDatabase;
