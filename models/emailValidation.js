const mongoose = require("mongoose");

const emailValidationSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    expires: {
        type: Date,
        required: false,
        default: new Date(new Date().setDate(new Date().getDate()+2)).toISOString()
    }
});
module.exports = mongoose.model("Email", emailValidationSchema);
