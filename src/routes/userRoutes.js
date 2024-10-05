const express = require("express");
const router = express.Router();
const {
    // updatestockquantity,
stockCheck,
poststock
   
} = require('../controllers/userController');
const { errorLogger, successLogger } = require('../logger.js');

// Add tanks route
router.post('/addStock', async(req, res, next) => {
    successLogger.info(`POST /stockData - Add tank request received`);
    poststock(req, res)
        .then(() => {
            successLogger.info(`POST /stockData - Successfully added tank`);
        })
        .catch((err) => {
            errorLogger.error(`POST /stockData - Error adding tank: ${err.message}`);
            next(err); // Pass error to express middleware
        });
});

// // Get tanks route
router.post('/stockCheck',(req, res, next) => {
    successLogger.info(`POST /stockCheck - Tanks data request received`);
    stockCheck(req, res)
        .then(() => {
            successLogger.info(`POST/stockCheck - Successfully retrieved tank data`);
        })
        .catch((err) => {
            errorLogger.error(`POST /stockCheck - Error retrieving tanks: ${err.message}`);
            next(err); // Pass error to express middleware
        });
});

// router.put('/updateStockQuantity', (req, res, next) => {
//     successLogger.info(`PUT /updateStockQuantity - Attempt to update stock for ${req.body.item_id}`);
//     updatestockquantity(req, res)
//         .then(() => {
//             successLogger.info(`PUT /updateStockQuantity - Successfully updated stock for item: ${req.body.item_id}`);
//         })
//         .catch((err) => {
//             errorLogger.error(`PUT /updateStockQuantity - Error updating stock: ${err.message}`);
//             next(err); // Pass error to express middleware
//         });
// });






module.exports = router;
