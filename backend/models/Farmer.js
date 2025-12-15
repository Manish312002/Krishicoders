import mongoose from 'mongoose';

const farmerSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        village: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },
    preferredLanguage: { type: String, required: true },
    farmSize: { type: Number, required: true }, // in acres
    cropTypes: [{ type: String }],
}, {
    timestamps: true,
});

const Farmer = mongoose.model('Farmer', farmerSchema);

export default Farmer;
