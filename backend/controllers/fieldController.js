import asyncHandler from 'express-async-handler';
import Field from '../models/Field.js';
import Farmer from '../models/Farmer.js';

// @desc    Get all fields for current farmer
// @route   GET /api/fields
// @access  Private
export const getFields = asyncHandler(async (req, res) => {
    // Find farmer associated with user
    const farmer = await Farmer.findOne({ userId: req.user._id });

    if (!farmer) {
        res.status(404);
        throw new Error('Farmer profile not found');
    }

    const fields = await Field.find({ farmerId: farmer._id });
    res.json(fields);
});

// @desc    Add a new field
// @route   POST /api/fields
// @access  Private
export const createField = asyncHandler(async (req, res) => {
    const {
        name,
        area,
        cropType,
        plantingDate,
        expectedHarvestDate,
        coordinates,
        soilType,
        irrigationType
    } = req.body;

    const farmer = await Farmer.findOne({ userId: req.user._id });

    if (!farmer) {
        res.status(404);
        throw new Error('Farmer profile not found');
    }

    const field = await Field.create({
        farmerId: farmer._id,
        name,
        area,
        cropType,
        plantingDate,
        expectedHarvestDate,
        coordinates,
        soilType,
        irrigationType
    });

    res.status(201).json(field);
});

// @desc    Update a field
// @route   PUT /api/fields/:id
// @access  Private
export const updateField = asyncHandler(async (req, res) => {
    const field = await Field.findById(req.params.id);
    if (!field) {
        res.status(404);
        throw new Error('Field not found');
    }

    // Ensure farmer owns this field
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer || field.farmerId.toString() !== farmer._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updates = {};
    const allowed = ['name','area','cropType','plantingDate','expectedHarvestDate','coordinates','soilType','irrigationType'];
    allowed.forEach(k => {
        if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    Object.assign(field, updates);
    const updated = await field.save();
    res.json(updated);
});

// @desc    Delete a field
// @route   DELETE /api/fields/:id
// @access  Private
export const deleteField = asyncHandler(async (req, res) => {
    const field = await Field.findById(req.params.id);
    if (!field) {
        res.status(404);
        throw new Error('Field not found');
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer || field.farmerId.toString() !== farmer._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    console.log('Delete request details:', {
        reqUserId: req.user._id?.toString(),
        fieldId: req.params.id,
        fieldFarmerId: field.farmerId?.toString(),
        farmerFoundId: farmer._id?.toString(),
    });

    // Delete via Model method and inspect result
    const result = await Field.deleteOne({ _id: req.params.id });
    console.log(`DeleteOne result for ${req.params.id}:`, result);

    // result.deletedCount === 1 means deletion succeeded
    const deleted = result.deletedCount === 1;
    console.log(`Field ${req.params.id} deletion success:`, deleted, 'by user', req.user._id);
    res.json({ message: 'Field removed', id: req.params.id, deletedCount: result.deletedCount });
});

export default { getFields, createField, updateField, deleteField };
