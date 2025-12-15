import mongoose from 'mongoose';

const irrigationLogSchema = mongoose.Schema({
    systemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'IrrigationSystem' },
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    startTime: { type: Number, required: true },
    endTime: { type: Number },
    duration: { type: Number }, // in minutes
    waterAmount: { type: Number }, // in liters
    triggerType: { type: String, required: true }, // "manual", "scheduled", "sensor", "ai"
    triggeredBy: { type: String },
}, {
    timestamps: true,
});

const IrrigationLog = mongoose.model('IrrigationLog', irrigationLogSchema);

export default IrrigationLog;
