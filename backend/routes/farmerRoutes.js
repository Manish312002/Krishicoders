import express from 'express';
import { getFarmerProfile, createFarmerProfile } from '../controllers/farmerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createFarmerProfile);

router.route('/profile')
    .get(protect, getFarmerProfile);

export default router;
