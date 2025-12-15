import express from 'express';
import { getSensorsByField, createSensor, addReading } from '../controllers/sensorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createSensor);
router.route('/reading').post(protect, addReading);
router.route('/:fieldId').get(protect, getSensorsByField);

export default router;
