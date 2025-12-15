import mongoose from 'mongoose';

const sensorReadingSchema = mongoose.Schema({
    sensorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Sensor' },
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    timestamp: { type: Number, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    sensorType: { type: String, required: true },
}, {
    timestamps: true,
});

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

export default SensorReading;
