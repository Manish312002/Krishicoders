import express from 'express';
import { analyzeImage, getAnalysisHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analyze').post(protect, analyzeImage);
router.route('/history/:fieldId').get(protect, getAnalysisHistory);

export default router;
