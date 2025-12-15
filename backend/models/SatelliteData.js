import mongoose from 'mongoose';

const satelliteDataSchema = mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    source: { type: String, required: true }, // "sentinel", "landsat"
    imageDate: { type: Number, required: true },
    cloudCover: { type: Number, required: true },
    ndviValue: { type: Number, required: true },
    eviValue: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    analysisResults: {
        vegetationHealth: { type: String },
        waterStress: { type: Boolean },
        growthStage: { type: String },
    },
}, {
    timestamps: true,
});

const SatelliteData = mongoose.model('SatelliteData', satelliteDataSchema);

export default SatelliteData;
