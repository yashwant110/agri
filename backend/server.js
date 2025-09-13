// server.js

// 1. Import necessary libraries
const express = require('express');
const cors = require('cors');
const path = require('path');

// 2. Initialize an Express application
const app = express();
const PORT = 5000; // We'll run our backend on port 5000
// 3. Set up Middleware
app.use(cors()); 
app.use(express.json());


// ---- ADD THIS NEW CODE BLOCK ----
// This is our new "welcome" route for the main URL
app.get('/', (req, res) => {
    res.send('<h1>✅ AgriSolution Backend is running!</h1><p>This server is waiting for POST requests from the frontend.</p>');
});
// ---------------------------------


// 4. Import our API routes
const apiRoutes = require('./routes/api');

// 5. Tell Express to use our routes
// Any URL starting with /api will be handled by the router we just imported.
app.use('/api', apiRoutes);

// 6. Start the server
app.listen(PORT, () => {
    console.log(`✅ Backend server is running successfully on http://localhost:${PORT}`);
});