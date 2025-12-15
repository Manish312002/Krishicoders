import mongoose from 'mongoose';

const sensorSchema = mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    sensorId: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // "moisture", "temperature", "humidity", "ph", "npk"
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    isActive: { type: Boolean, default: true },
    lastReading: {
        value: { type: Number },
        timestamp: { type: Number },
        unit: { type: String },
    },
}, {
    timestamps: true,
});

const Sensor = mongoose.model('Sensor', sensorSchema);

export default Sensor;
