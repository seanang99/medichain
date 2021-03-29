const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const option = { discriminatorKey: 'kind' };

const accountSchema = new Schema
(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            minlength: 8,
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        }
    },
    {
        timestamps: true
    },
    option
)

const accountModel = mongoose.model('Account',accountSchema)
module.exports = accountModel
