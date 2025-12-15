import asyncHandler from 'express-async-handler';
import path from 'path';
import CropImage from '../models/CropImage.js';

// @desc    Upload image locally (Development)
// @route   POST /api/upload
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    // In production, upload to S3/Cloudinary. Here we use local server.
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
        url: imageUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype
    });
});

export default { uploadImage };
