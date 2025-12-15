import asyncHandler from 'express-async-handler';
import IrrigationSystem from '../models/IrrigationSystem.js';
import IrrigationLog from '../models/IrrigationLog.js';
import Field from '../models/Field.js';

// @desc    Get irrigation systems by field
// @route   GET /api/irrigation/systems/:fieldId
// @access  Private
export const getIrrigationSystems = asyncHandler(async (req, res) => {
    const systems = await IrrigationSystem.find({ fieldId: req.params.fieldId });
    res.json(systems);
});

// @desc    Create irrigation system
// @route   POST /api/irrigation/systems
// @access  Private
export const createIrrigationSystem = asyncHandler(async (req, res) => {
    const { fieldId, type, zoneId } = req.body;

    const system = await IrrigationSystem.create({
        fieldId,
        type,
        zoneId,
        status: 'idle',
        lastMaintenanceDate: Date.now()
    });

    res.status(201).json(system);
});

// @desc    Start/Stop Irrigation
// @route   POST /api/irrigation/control
// @access  Private
export const controlIrrigation = asyncHandler(async (req, res) => {
    const { systemId, action, duration } = req.body; // action: 'start' | 'stop'

    const system = await IrrigationSystem.findById(systemId);
    if (!system) {
        res.status(404);
        throw new Error('Irrigation System not found');
    }

    if (action === 'start') {
        system.status = 'running';
        await system.save();

        // Create Log
        await IrrigationLog.create({
            systemId,
            fieldId: system.fieldId,
            startTime: Date.now(),
            duration: duration || 0, // minutes
            waterAmount: 0, // Calculated later
            status: 'running'
        });

        // Mock Scheduler: Stop automatically after duration (if provided)
        if (duration) {
            setTimeout(async () => {
                const s = await IrrigationSystem.findById(systemId);
                if (s && s.status === 'running') {
                    s.status = 'idle';
                    await s.save();
                    console.log(`Auto-stopped irrigation for ${systemId}`);

                    // Update log to completed
                    const log = await IrrigationLog.findOne({ systemId, status: 'running' }).sort({ startTime: -1 });
                    if (log) {
                        log.endTime = Date.now();
                        log.status = 'completed';
                        log.waterAmount = (duration * 15); // Mock calc: 15 liters per min
                        await log.save();
                    }
                }
            }, duration * 60 * 1000); // Minutes to ms 
            // In production, use BullMQ or a real job queue, not setTimeout
        }

        res.json({ message: `Irrigation started for ${duration ? duration + ' mins' : 'manual stop'}`, system });

    } else if (action === 'stop') {
        system.status = 'idle';
        await system.save();

        // Find active log and close it
        const log = await IrrigationLog.findOne({ systemId, status: 'running' }).sort({ startTime: -1 });
        if (log) {
            log.endTime = Date.now();
            log.status = 'completed';
            // Calculate actual duration
            const durationMins = (log.endTime - log.startTime) / (1000 * 60);
            log.waterAmount = Math.floor(durationMins * 15);
            await log.save();
        }

        res.json({ message: 'Irrigation stopped', system });
    } else {
        res.status(400);
        throw new Error('Invalid action');
    }
});

// @desc    Get irrigation logs
// @route   GET /api/irrigation/logs/:fieldId
// @access  Private
export const getIrrigationLogs = asyncHandler(async (req, res) => {
    const logs = await IrrigationLog.find({ fieldId: req.params.fieldId })
        .sort({ startTime: -1 })
        .limit(20);
    res.json(logs);
});

export default {
    getIrrigationSystems,
    createIrrigationSystem,
    controlIrrigation,
    getIrrigationLogs
};
