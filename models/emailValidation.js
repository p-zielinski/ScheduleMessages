const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const emailValidationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: false,
    default: new Date(
      new Date().setDate(new Date().getDate() + 2)
    ).toISOString(),
  },
  key: {
    type: String,
    required: false,
    default: nanoid(24),
  },
  last_time_sent: {
    type: String,
    required: false,
    default: new Date().toISOString(),
  },
});
module.exports = mongoose.model("Email", emailValidationSchema);
