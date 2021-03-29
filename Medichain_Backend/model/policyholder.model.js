const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const account = require('./account.model')

const policyholderSchema = new Schema(
    {
        identificationNum : {
            type: String,
            required: true,
            trim: true,
            minlength: 9,
            unique: true
        }
    },
    {
        timestamps:true
    }
)

const policyholderModel = account.discriminator('Policyholder', policyholderSchema)
module.exports = policyholderModel