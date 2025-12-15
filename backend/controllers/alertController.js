import asyncHandler from 'express-async-handler';
import Alert from '../models/Alert.js';

// @desc    Get all alerts for a farmer (across all fields)
// @route   GET /api/alerts
// @access  Private
export const getAlerts = asyncHandler(async (req, res) => {
    const alerts = await Alert.find({ farmerId: req.user._id })
        .sort({ createdAt: -1 })
        .populate('fieldId', 'name'); // optionally populate field name
    res.json(alerts);
});

// @desc    Create a new alert (System generated or Manual)
// @route   POST /api/alerts
// @access  Private
export const createAlert = asyncHandler(async (req, res) => {
    const { fieldId, type, title, message, severity } = req.body;

    const alert = await Alert.create({
        farmerId: req.user._id,
        fieldId,
        type,
        title,
        message,
        severity: severity || 'medium',
        isRead: false,
        isResolved: false
    });

    res.status(201).json(alert);
});

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const alert = await Alert.findOne({ _id: req.params.id, farmerId: req.user._id });

    if (alert) {
        alert.isRead = true;
        await alert.save();
        res.json(alert);
    } else {
        res.status(404);
        throw new Error('Alert not found');
    }
});

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
export const resolveAlert = asyncHandler(async (req, res) => {
    const alert = await Alert.findOne({ _id: req.params.id, farmerId: req.user._id });

    if (alert) {
        alert.isResolved = true;
        await alert.save();
        res.json(alert);
    } else {
        res.status(404);
        throw new Error('Alert not found');
    }
});

export default { getAlerts, createAlert, markAsRead, resolveAlert };
