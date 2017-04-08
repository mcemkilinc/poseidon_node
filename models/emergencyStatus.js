var mongoose = require('mongoose');

var emergencyStatusSchema = new mongoose.Schema(
    {emergencyStatusData:
    {
        emergencyText: { type: String, default: '' },
        emergencyLevel: { type: String, default: '' },
        emergencyActive: { type: String, default: '' }
    }
    },
    { timestamps: true });

var emergencyStatus = mongoose.model('emergencyStatus', emergencyStatusSchema);

module.exports = emergencyStatus;
