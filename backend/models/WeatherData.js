import mongoose from 'mongoose';

const weatherDataSchema = mongoose.Schema({
    location: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible location structure
    timestamp: { type: Number, required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    cloudCover: { type: Number },
    condition: { type: String },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    pressure: { type: Number, required: true },
    forecast: [{
        date: { type: Number },
        temperature: {
            min: { type: Number },
            max: { type: Number },
        },
        humidity: { type: Number },
        rainfall: { type: Number },
        conditions: { type: String },
    }],
}, {
    timestamps: true,
});

// Index for efficient querying by location and time
weatherDataSchema.index({ 'location.lat': 1, 'location.lng': 1, timestamp: 1 });

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
