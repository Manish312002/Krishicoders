import mongoose from 'mongoose';

const alertSchema = mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Farmer' },
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    type: { type: String, required: true }, // "irrigation", "disease", "weather", "harvest"
    severity: { type: String, required: true }, // "low", "medium", "high", "critical"
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now }, // Explicitly matching schema
    resolvedAt: { type: Number },
    actionRequired: {
        type: { type: String }, // "irrigation", "treatment", "inspection"
        parameters: {
            duration: { type: Number },
            amount: { type: Number },
        },
    },
}, {
    timestamps: true,
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
