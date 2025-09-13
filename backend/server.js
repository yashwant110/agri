// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Use Render’s port or default to 5000 locally
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---- Welcome Route ----
app.get('/health', (req, res) => {
  res.send('<h1>✅ AgriSolution Backend is running!</h1><p>This server is waiting for POST requests from the frontend.</p>');
});

// ✅ Serve frontend (update folder if different)
app.use(express.static(path.join(__dirname, 'pages')));

// Catch-all route → send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// ✅ API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
