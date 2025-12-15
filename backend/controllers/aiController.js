import asyncHandler from 'express-async-handler';
// import OpenAI from 'openai';
import CropImage from '../models/CropImage.js';
import Field from '../models/Field.js';
import Alert from '../models/Alert.js';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY || 'mock-key', // Fallback for dev without key
// });

// @desc    Upload and analyze crop image
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeImage = asyncHandler(async (req, res) => {
    const { fieldId, imageUrl, notes } = req.body;

    // 1. Save initial record
    const cropImage = await CropImage.create({
        fieldId,
        farmerId: req.user._id,
        imageUrl,
        notes,
        imageType: 'crop_health',
        analysisStatus: 'processing',
        captureDate: Date.now()
    });

    try {
        // 2. AI Analysis Logic (Mocked if no key, or real if key exists)
        let aiResults;

        // OpenAI integration temporarily disabled — always use mock analysis
        // if (process.env.OPENAI_API_KEY) {
        //     // Real OpenAI Call
        //     const response = await openai.chat.completions.create({
        //         model: "gpt-4",
        //         messages: [
        //             { role: "developer", content: "You are an agricultural expert AI. Analyze the image URL provided for crop diseases." },
        //             { role: "user", content: [ { type: "text", text: "Analyze this crop image for diseases, health score, and recommendations. Return JSON." }, { type: "image_url", image_url: { url: imageUrl } } ] }
        //         ],
        //     });
        //     // Parsing logic would go here
        //     aiResults = mockAnalysis();
        // } else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        aiResults = mockAnalysis();
        // }

        // 3. Update Record
        cropImage.analysisStatus = 'completed';
        cropImage.analysisResults = aiResults;
        await cropImage.save();

        // 4. Create Alert if disease detected
        if (aiResults.diseaseDetected) {
            await Alert.create({
                farmerId: req.user._id,
                fieldId,
                type: 'disease',
                severity: aiResults.diseases[0]?.severity || 'medium',
                title: `Disease Detected: ${aiResults.diseases[0]?.name}`,
                message: `AI analysis detected potential ${aiResults.diseases[0]?.name} in your field.`,
                isRead: false,
                isResolved: false
            });
        }

        res.status(201).json(cropImage);

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        cropImage.analysisStatus = 'failed';
        await cropImage.save();
        res.status(500);
        throw new Error('AI Analysis failed');
    }
});

// Helper to generate mock data matching the frontend expectations
const mockAnalysis = () => ({
    diseaseDetected: Math.random() > 0.5,
    diseases: [
        {
            name: ["Leaf Blight", "Rust", "Powdery Mildew"][Math.floor(Math.random() * 3)],
            confidence: 0.85 + (Math.random() * 0.1),
            severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
            affectedArea: Math.floor(Math.random() * 20)
        }
    ],
    healthScore: Math.floor(Math.random() * 40) + 60,
    recommendations: [
        "Apply fungicide treatment immediately",
        "Improve air circulation between plants",
        "Monitor water levels carefully"
    ]
});

// @desc    Get analysis history
// @route   GET /api/ai/history/:fieldId
// @access  Private
export const getAnalysisHistory = asyncHandler(async (req, res) => {
    const history = await CropImage.find({
        fieldId: req.params.fieldId,
        farmerId: req.user._id
    }).sort({ createdAt: -1 });
    res.json(history);
});

export default { analyzeImage, getAnalysisHistory };
