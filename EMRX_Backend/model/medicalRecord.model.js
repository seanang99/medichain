const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalRecordSchema = new Schema(
    {
        recordType: {
            type: String,
            required: [true, "Record type is required"],
            trim: true
        },
        recordDetails: {
            type: String,
            required: [true, "Record Details is required"],
            trim: true
        },
        totalAmt: {
            type: Number,
            required: [true, "Total amount is required"],
            trim: true
        },
        fileUrl: {
            type: String,
            required: [true, "Reference File URL is required"],
            trim: true
        },
        patientId: {
            type: Schema.Types.ObjectId,
            required: [true, "Patient Id is required"],
            ref: "Patient"
        }
    },
    {
        timestamps: true
    }
);

const medicalRecordModel = mongoose.model('MedicalRecord', medicalRecordSchema);
module.exports = medicalRecordModel;