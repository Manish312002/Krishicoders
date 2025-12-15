import mongoose from 'mongoose';

const fieldSchema = mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Farmer' },
    name: { type: String, required: true },
    area: { type: Number, required: true }, // in acres
    cropType: { type: String, required: true },
    plantingDate: { type: Number, required: true },
    expectedHarvestDate: { type: Number, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    soilType: { type: String, required: true },
    irrigationType: { type: String, required: true },
}, {
    timestamps: true,
});

const Field = mongoose.model('Field', fieldSchema);

export default Field;
