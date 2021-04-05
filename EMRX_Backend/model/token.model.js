const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        tokenValue: {
            type: String,
            required: [true, "Token value is required"]
        },
        isExpired: {
            type: Boolean, default: false
        },
        medicalRecords: [{
            type: Schema.Types.ObjectId,
            ref: "MedicalRecord",
            required: [true, "Medical Record is required"]
        }],
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: [true, "Patient Id is required"]
        }
    },
    {
        timestamps: true
    }
)

const tokenModel = mongoose.model("Token", tokenSchema);
module.exports = tokenModel;