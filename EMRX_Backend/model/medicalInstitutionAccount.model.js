const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalInsitutionAccountSchema = new Schema(
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
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        medicalInstituteName: {
            type: String,
            required: [true, "Medical Institute name is required"]
        }
    },
    {
        timestamps: true
    }
);

const medicalInstituteAccountModel = mongoose.model('MedicalInstituteAccount', medicalInsitutionAccountSchema);
module.exports = medicalInstituteAccountModel;