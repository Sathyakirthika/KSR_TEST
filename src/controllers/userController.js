const moment = require("moment-timezone");
const db = require('../config/db'); // MySQL connection
const { errorLogger, successLogger } = require('../logger.js');

moment.tz.setDefault("Asia/Kolkata");

// POST Stock Data
const poststock = async (req, res) => {
    const { tankname, oilname, currentquantity, materialtype } = req.body;

    try {
        // Check if the tankname already exists
        const [existingTank] = await db.promise().query(
            `SELECT * FROM stock_Table WHERE tankname = ?`,
            [tankname]
        );

        if (existingTank.length > 0) {
            errorLogger.error('Tankname already exists: ' + tankname);
            return res.status(400).json({ success: false, error: 'Tankname already exists' });
        }

        // Insert new stock entry
        const [result] = await db.promise().query(
            `INSERT INTO stock_Table (tankname, oilname, currentquantity, materialtype)
             VALUES (?, ?, ?, ?)`,
            [tankname, oilname, currentquantity, materialtype]
        );

        successLogger.info('Stock added successfully: ' + result.insertId);
        return res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error adding stock:', error);
        errorLogger.error('Error adding stock: ' + error.message);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const getStock = async (req, res) => {
    const { tankname } = req.query;

    try {
        // If tankname is provided, fetch the specific stock
        if (tankname) {
            const [results, fields] = await db.promise().query(
                `SELECT * FROM stock_Table WHERE tankname = ?`,
                [tankname]
            );

            console.log('Query Results:', results); // Log the results

            // Check if results is an array
            if (!Array.isArray(results)) {
                return res.status(500).json({ success: false, error: 'Query result is not an array' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, error: 'Tankname not found' });
            }

            return res.json({ success: true, data: results });
        }

        // If no tankname is provided, fetch all stocks
        const [stocks, fields] = await db.promise().query(
            `SELECT * FROM stock_Table`
        );

        console.log('All Stocks:', stocks); // Log the stocks

        // Check if stocks is an array
        if (!Array.isArray(stocks)) {
            return res.status(500).json({ success: false, error: 'Query result is not an array' });
        }

        return res.json({ success: true, data: stocks });
    } catch (error) {
        console.error('Error retrieving stock:', error);
        errorLogger.error('Error retrieving stock: ' + error.message);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};




// Stock Check Data
const stockCheck = async (req, res) => {
    const { entries } = req.body; // Expecting entries to be an array of objects

    try {
        // Validate the entries
        await validateEntries(entries);

        return res.status(200).json({ success: true, message: 'All entries are valid.' });
    } catch (error) {
        errorLogger.error('Validation failed: ' + error.message);
        return res.status(400).json({ success: false, error: error.message });
    }
};

const validateEntries = async (entries) => {
    for (const entry of entries) {
        const { oilname: product, tankname: ptank, currentquantity: pqty } = entry;

        // Check if product, ptank, and pqty are provided
        if (!product || !ptank || !pqty) {
            throw new Error('Product, tank name, and quantity are required.');
        }

        // Query to check the existing stock in the specified tank
        const [productResults] = await db.promise().query(
            `SELECT oilname, currentquantity FROM stock_Table WHERE tankname = ?`,
            [ptank]
        );

        // If there are existing products in the tank, check for conflicts
        if (productResults.length > 0) {
            const existingMaterials = productResults.filter(row => row.oilname !== product);
            if (existingMaterials.length > 0) {
                throw new Error(`Tank '${ptank}' already contains different materials.`);
            }
        }

        // Query to get the tank capacity
        const [tankResults] = await db.promise().query(
            `SELECT tankcapacity FROM storagetank_Table WHERE tankname = ?`,
            [ptank]
        );

        if (tankResults.length === 0) {
            throw new Error(`No tank capacity entry found for tank '${ptank}'`);
        }

        const tankCapacity = Number(tankResults[0].tankcapacity);
        let currentQty = 0;

        // Check the current quantity of the product in the tank
        if (productResults.length > 0) {
            currentQty = Number(productResults[0].currentquantity);
            const newQty = currentQty + Number(pqty);

            // Check if new quantity exceeds tank capacity
            if (newQty > tankCapacity) {
                throw new Error(`${pqty} + ${currentQty} = ${newQty} exceeds ${tankCapacity} for tank '${ptank}' and product '${product}'`);
            }
        } else {
            // If no current product exists, validate against tank capacity directly
            if (Number(pqty) > tankCapacity) {
                throw new Error(`Entered '${pqty}' exceeds '${tankCapacity}' for tank '${ptank}' and product '${product}'`);
            }
        }
    }
};

module.exports = { poststock, stockCheck ,getStock};
