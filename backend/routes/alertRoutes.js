import express from 'express';
import { getAlerts, createAlert, markAsRead, resolveAlert } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAlerts).post(protect, createAlert);
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id/resolve').put(protect, resolveAlert);

export default router;
