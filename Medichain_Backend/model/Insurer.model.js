const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const account = require('./account.model')

const insurerSchema = new Schema(
    {
        employeeId : {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 8
        }
    },
    {
        timestamps:true
    }
)

const insurerModel = account.discriminator('Insurer', insurerSchema)
module.exports = insurerModel