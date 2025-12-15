import mongoose from 'mongoose';

const cropImageSchema = mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Farmer' },
    imageUrl: { type: String, required: true }, // Storing URL instead of ID for simplicity
    imageType: { type: String, required: true }, // "hyperspectral", "multispectral", "rgb"
    captureDate: { type: Number, required: true },
    analysisStatus: { type: String, required: true, default: 'pending' }, // "pending", "processing", "completed", "failed"
    analysisResults: {
        diseaseDetected: { type: Boolean },
        diseases: [{
            name: { type: String },
            confidence: { type: Number },
            severity: { type: String },
            affectedArea: { type: Number },
        }],
        healthScore: { type: Number },
        stressLevel: { type: String },
        recommendations: [{ type: String }],
    },
}, {
    timestamps: true,
});

const CropImage = mongoose.model('CropImage', cropImageSchema);

export default CropImage;
