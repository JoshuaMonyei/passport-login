const mongoose = require('mongoose');


// user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
},
{timestamps: true})

module.exports = mongoose.model("User", UserSchema);