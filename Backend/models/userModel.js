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
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    location: {
        type: String,
    },
    work: {
        type: String,
    },
    followers: {
        type: Number,
        default: 0,
    },
    followedBy: [{ type: mongoose.Schema.Types.ObjectId }],
    following: {
        type: Number,
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