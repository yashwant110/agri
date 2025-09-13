// backend/controllers/predictionController.js

const fs = require('fs').promises;

// --- DATABASE SECTION ---

const PREDEFINED_DISEASES = {
    'tomato_late_blight.jpg': {
        en: { disease: 'Tomato - Late Blight', suggestion: 'Apply copper-based fungicides immediately.' },
        hi: { disease: 'टमाटर - पछेती झुलसा', suggestion: 'तुरंत तांबा आधारित फफूंदनाशकों का छिड़काव करें।' },
        te: { disease: 'టమోటా - లేట్ బ్లైట్', suggestion: 'వెంటనే కాపర్ ఆధారిత శిలీంద్రనాశకాలను వాడండి।' }
    },
    'apple_scab.jpg': {
        en: { disease: 'Apple - Apple Scab', suggestion: 'Remove and destroy fallen leaves. Apply fungicides.' },
        hi: { disease: 'सेब - एप्पल स्कैब', suggestion: 'गिरी हुई पत्तियों को हटाकर नष्ट कर दें। फफूंदनाशकों का प्रयोग करें।' },
        te: { disease: 'ఆపిల్ - ఆపిల్ స్కాబ్', suggestion: 'రాలిన ఆకులను తీసివేసి నాశనం చేయండి. శిలీంద్రనాశకాలను వాడండి।' }
    }
};

const MARKET_DATA = {
    'hyderabad': { location: 'Hyderabad', crop: 'Onion', price: '₹ 1,550 / quintal', trend: 'Stable' },
    'delhi': { location: 'Delhi (Azadpur Mandi)', crop: 'Tomato', price: '₹ 1,200 / quintal', trend: 'Slightly down' },
    'mumbai': { location: 'Mumbai (Vashi)', crop: 'Potato', price: '₹ 1,800 / quintal', trend: 'Rising' },
    'chennai': { location: 'Chennai (Koyambedu)', crop: 'Carrot', price: '₹ 2,500 / quintal', trend: 'Stable' },
    'kolkata': { location: 'Kolkata', crop: 'Cabbage', price: '₹ 900 / quintal', trend: 'Stable' },
    'vizag': { location: 'Visakhapatnam', crop: 'Banana', price: '₹ 1200 / quintal', trend: 'stable' }
};

const IRRIGATION_ADVICE = {
    'wheat': { 
        advice: "Recommendation for Wheat: The soil is currently moist. With light rain expected, DO NOT irrigate for the next 48 hours to prevent waterlogging." 
    },
    'rice': { 
        advice: "Recommendation for Rice/Paddy: Maintain a shallow flood of 2-3 inches. With no rain expected, a light irrigation cycle is recommended tomorrow morning." 
    },
    'cotton': { 
        advice: "Recommendation for Cotton: Cotton is drought-tolerant. The current soil moisture is sufficient. Delay irrigation until the topsoil feels dry to the touch." 
    },
    'sugarcane': { 
        advice: "Recommendation for Sugarcane: This crop requires significant water. A deep irrigation cycle is recommended today as the weather is clear and sunny." 
    },
    'default': {
        advice: "General Recommendation: Check the top 2 inches of soil. If it is dry, a light irrigation cycle is recommended. Always water early in the morning to reduce evaporation."
    }
};
const GOVT_SCHEMES = [
    { name: 'PM Kisan Samman Nidhi', state: 'All', crop: 'All', details: 'Provides income support of ₹6,000/year to all eligible farmer families.' },
    { name: 'PM Fasal Bima Yojana (PMFBY)', state: 'All', crop: 'All', details: 'Provides insurance coverage against crop failure due to natural calamities.' },
    { name: 'Kisan Credit Card (KCC)', state: 'All', crop: 'All', details: 'Offers short-term formal credit to farmers.' },
    { name: 'Rythu Bandhu', state: 'telangana', crop: 'All', details: 'Provides ₹5,000/acre per season to support farm investment for all crops.' },
    { name: 'YSR Rythu Bharosa', state: 'andhra pradesh', crop: 'All', details: 'Financial assistance of ₹13,500 per farmer family per year.' },
    { name: 'National Mission on Oilseeds and Oil Palm', state: 'All', crop: 'oilseed', details: 'Aims to increase the production of oilseeds and oil palm.' },
    { name: 'Sub-Mission on Agricultural Mechanization (SMAM)', state: 'All', crop: 'All', details: 'Promotes farm mechanization to increase efficiency.' },
    { name: 'MSP for Minor Forest Produce', state: 'All', crop: 'forest', details: 'Provides a safety net for tribal gatherers by ensuring fair prices.' }
];


// --- CONTROLLER FUNCTIONS ---

// 1. Disease Prediction
exports.predictDisease = async (req, res) => {
    try {
        const lang = req.body.lang || 'en';
        const originalFilename = req.file.originalname;
        const diseaseData = PREDEFINED_DISEASES[originalFilename];
        if (diseaseData) {
            res.json(diseaseData[lang] || diseaseData['en']);
        } else {
            const noMatchResponse = {
                en: { disease: 'Disease Not Recognized', suggestion: 'This image is not in our pre-defined demo set.' },
                hi: { disease: 'रोग की पहचान नहीं हुई', suggestion: 'यह छवि हमारे डेमो सेट में नहीं है।' },
                te: { disease: 'వ్యాధిని గుర్తించలేదు', suggestion: 'ఈ చిత్రం మా డెమో సెట్‌లో లేదు.' }
            };
            res.json(noMatchResponse[lang] || noMatchResponse['en']);
        }
        await fs.unlink(req.file.path);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};

// 2. Market Prediction
exports.predictMarket = async (req, res) => {
    try {
        const userInput = (req.body.location || '').toLowerCase().trim();
        if (MARKET_DATA[userInput]) {
            res.json(MARKET_DATA[userInput]);
        } else {
            const keys = Object.keys(MARKET_DATA);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            res.json(MARKET_DATA[randomKey]);
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
};

// 3. Smart Irrigation Advice
exports.predictIrrigation = async (req, res) => {
    try {
        let userInput = (req.body.crop || '').toLowerCase().trim();

        // Add an alias: if the user types "paddy", we treat it as "rice"
        if (userInput === 'paddy') {
            userInput = 'rice';
        }

        if (IRRIGATION_ADVICE[userInput]) {
            res.json(IRRIGATION_ADVICE[userInput]);
        } else {
            res.json(IRRIGATION_ADVICE['default']);
        }
    } catch (error) {
        // Send an object with an 'advice' key even on error to prevent "undefined" on the frontend
        res.status(500).json({ advice: 'Error on server. Could not get advice.' });
    }
};

// 4. Fertilizer Calculator
exports.predictFertilizer = async (req, res) => {
    res.json({ mix: "Recommended Mix: NPK 19-19-19", advice: "Apply 25kg per acre." });
};

// 5. Government Schemes
exports.predictSchemes = async (req, res) => {
    try {
        const stateInput = (req.body.state || '').toLowerCase().trim();
        const cropInput = (req.body.crop || '').toLowerCase().trim();
        console.log(`Scheme search for State: "${stateInput}", Crop: "${cropInput}"`);

        // Start with all schemes and filter them down
        const relevantSchemes = GOVT_SCHEMES.filter(scheme => {
            const stateMatch = !stateInput || scheme.state === 'All' || scheme.state === stateInput;
            const cropMatch = !cropInput || scheme.crop === 'All' || scheme.crop === cropInput;
            return stateMatch && cropMatch;
        });
        
        console.log(`Found ${relevantSchemes.length} relevant schemes.`);
        res.json(relevantSchemes);

    } catch (error) {
        console.error('Error in scheme prediction:', error);
        res.status(500).json([]); // Return empty array on error
    }
};

// 6. Crop Insurance Claims
exports.fileInsuranceClaim = async (req, res) => {
    try {
        if (req.file) { 
            await fs.unlink(req.file.path); 
        }
        res.json({ claimId: `CL-${Math.floor(10000 + Math.random() * 90000)}`, status: 'Filed Successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred processing the claim.' });
    }
};

// 7. Post-Harvest Solutions
exports.findPostHarvest = async (req, res) => {
    res.json([{ name: 'Sri Venkateswara Cold Storage', distance: '5 km away', contact: '9876543210' }]);
};

// 8. AI Crop Recommender
exports.recommendCrop = async (req, res) => {
    res.json({ crop: 'Cotton', reason: 'Highest profitability forecast this season.' });
};