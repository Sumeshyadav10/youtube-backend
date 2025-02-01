const express = require('express');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();



// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});