const mongoose = require("mongoose");
const { nanoid } = require('nanoid')

const newUserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
        default: 'pending'
    },
    available_funds: {
        type: Number,
        required: false
    },
    user_signature: {
        type: Array,
        required: false,
    }
});

module.exports = mongoose.model("User", newUserSchema);
