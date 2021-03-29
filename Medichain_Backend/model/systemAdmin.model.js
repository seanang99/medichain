const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const account = require('./account.model')

const systemAdminSchema = new Schema(
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

const systemAdminModel = account.discriminator('SystemAdmin', systemAdminSchema)
module.exports = systemAdminModel