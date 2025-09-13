// routes/api.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure Multer for file uploads
// This tells Multer to store uploaded files in the 'backend/uploads' directory
const upload = multer({ dest: 'backend/uploads/' });

// Import the controller functions that hold our logic
const controller = require('../controllers/predictionController');

// --- DEFINE ALL 8 API ENDPOINTS FOR THE HACKATHON ---

// 1. Crop Disease & Soil Health (handles image upload)
// The `upload.single('file')` part is middleware that processes the image.
router.post('/predict/disease', upload.single('file'), controller.predictDisease);

// 2. Market Prices & Buyers (handles JSON data)
router.post('/predict/market', controller.predictMarket);

// 3. Smart Irrigation Advice
router.post('/predict/irrigation', controller.predictIrrigation);

// 4. Fertilizer Calculator
router.post('/predict/fertilizer', controller.predictFertilizer);

// 5. Government Schemes
router.post('/predict/schemes', controller.predictSchemes);

// 6. Crop Insurance Claims (handles image upload)
router.post('/claim/insurance', upload.single('file'), controller.fileInsuranceClaim);

// 7. Post-Harvest Solutions
router.post('/find/post-harvest', controller.findPostHarvest);

// 8. AI Crop Recommender
router.post('/recommend/crop', controller.recommendCrop);

// Export the router so our server.js can use it
module.exports = router;