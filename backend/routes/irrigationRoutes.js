import express from 'express';
import {
    getIrrigationSystems,
    createIrrigationSystem,
    controlIrrigation,
    getIrrigationLogs
} from '../controllers/irrigationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/systems').post(protect, createIrrigationSystem);
router.route('/systems/:fieldId').get(protect, getIrrigationSystems);
router.route('/control').post(protect, controlIrrigation);
router.route('/logs/:fieldId').get(protect, getIrrigationLogs);

export default router;
