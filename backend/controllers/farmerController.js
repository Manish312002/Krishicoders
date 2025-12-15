import asyncHandler from 'express-async-handler';
import Farmer from '../models/Farmer.js';

// @desc    Get current farmer profile
// @route   GET /api/farmers/profile
// @access  Private
export const getFarmerProfile = asyncHandler(async (req, res) => {
    const farmer = await Farmer.findOne({ userId: req.user._id });

    if (farmer) {
        res.json(farmer);
    } else {
        res.status(404);
        throw new Error('Farmer profile not found');
    }
});

// @desc    Create or update farmer profile
// @route   POST /api/farmers
// @access  Private
export const createFarmerProfile = asyncHandler(async (req, res) => {
    const {
        name,
        phone,
        location,
        preferredLanguage,
        farmSize,
        cropTypes
    } = req.body;

    let farmer = await Farmer.findOne({ userId: req.user._id });

    if (farmer) {
        // Update existing
        farmer.name = name || farmer.name;
        farmer.phone = phone || farmer.phone;
        farmer.location = location || farmer.location;
        farmer.preferredLanguage = preferredLanguage || farmer.preferredLanguage;
        farmer.farmSize = farmSize || farmer.farmSize;
        farmer.cropTypes = cropTypes || farmer.cropTypes;

        const updatedFarmer = await farmer.save();
        res.json(updatedFarmer);
    } else {
        // Create new
        const newFarmer = await Farmer.create({
            userId: req.user._id,
            name,
            phone,
            location,
            preferredLanguage,
            farmSize,
            cropTypes
        });

        res.status(201).json(newFarmer);
    }
});

export default { getFarmerProfile, createFarmerProfile };
