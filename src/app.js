const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const initializeDatabase = require('./config/createTable'); // Import table creation logic
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json()); 

// Middleware to parse JSON requests
app.use(express.json());

// Initialize the database and tables
initializeDatabase(); // This will run the table creation queries

// Define routes
app.use('/api/tank', userRoutes); // User API routes

// Define the root route (example)
app.get('/', (req, res) => {
    res.send('Welcome to the MySQL Node.js API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
