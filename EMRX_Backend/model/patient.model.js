const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true
        },
        identificationNum: {
            type: String,
            unique: true,
            required: [true, "Patient identification number is required"],
            min: [9, "Identification Number should be more than 9 characters"]
        },
        medicalRecords: [{
            type: Schema.Types.ObjectId,
            ref: "MedicalRecord"
        }],
        tokens: [{
            type: Schema.Types.ObjectId,
            ref: "Token"
        }]
    },
    {
        timestamps: true
    }
)

const patientModel = mongoose.model("Patient", patientSchema);
module.exports = patientModel;