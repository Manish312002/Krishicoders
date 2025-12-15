import mongoose from 'mongoose';

const irrigationSystemSchema = mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Field' },
    // Optional external/system identifier
    systemId: { type: String, unique: true, sparse: true },
    type: { type: String, required: true }, // "drip", "sprinkler", "flood"
    zoneId: { type: String },
    isActive: { type: Boolean, default: true },
    // Use `status` to match controller's usage ('idle', 'running', etc.)
    status: { type: String, default: 'idle' },
    // flowRate optional for demo; default to 0
    flowRate: { type: Number, default: 0 }, // liters per minute
    lastActivated: { type: Number },
    lastMaintenanceDate: { type: Number },
    totalWaterUsed: { type: Number, default: 0 }, // in liters
}, {
    timestamps: true,
});

const IrrigationSystem = mongoose.model('IrrigationSystem', irrigationSystemSchema);

export default IrrigationSystem;
