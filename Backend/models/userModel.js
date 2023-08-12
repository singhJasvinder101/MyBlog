const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        // required: true,
    },
    work: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)
module.exports = User