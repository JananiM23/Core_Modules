const { required } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
    },
    Otp: {
        type: String,
        trim: true
    },
    userRole: {
        type: Number,
        // required: true
    },
    mobile: {
        type: Number,
        // required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    OAuthUser: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);