import asyncHandler from 'express-async-handler';
import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import Field from '../models/Field.js';

// @desc    Get all sensors for a field
// @route   GET /api/sensors/:fieldId
// @access  Private
export const getSensorsByField = asyncHandler(async (req, res) => {
    const sensors = await Sensor.find({ fieldId: req.params.fieldId });
    res.json(sensors);
});

// @desc    Add a new sensor
// @route   POST /api/sensors
// @access  Private
export const createSensor = asyncHandler(async (req, res) => {
    const { fieldId, sensorId, type, location } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) {
        res.status(404);
        throw new Error('Field not found');
    }

    // Check if sensorId already exists
    const sensorExists = await Sensor.findOne({ sensorId });
    if (sensorExists) {
        res.status(400);
        throw new Error('Sensor ID already exists');
    }

    const sensor = await Sensor.create({
        fieldId,
        sensorId,
        type,
        location,
        isActive: true,
        lastReading: null
    });

    res.status(201).json(sensor);
});

// @desc    Add a reading (Data Ingestion)
// @route   POST /api/sensors/reading
// @access  Private (or API Key protected in real world)
export const addReading = asyncHandler(async (req, res) => {
    const { sensorId, value, unit, sensorType } = req.body;

    const sensor = await Sensor.findOne({ _id: sensorId });
    if (!sensor) {
        res.status(404);
        throw new Error('Sensor not found');
    }

    const reading = await SensorReading.create({
        sensorId: sensor._id,
        fieldId: sensor.fieldId,
        value,
        unit,
        sensorType,
        timestamp: Date.now()
    });

    // Update sensor last reading
    sensor.lastReading = {
        value,
        timestamp: Date.now(),
        unit
    };
    await sensor.save();

    res.status(201).json(reading);
});

export default { getSensorsByField, createSensor, addReading };
