const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const changePasswordSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: false,
    default: new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toISOString(),
  },
  key: {
    type: String,
    required: false,
    default: nanoid(68),
  },
  last_time_sent: {
    type: String,
    required: false,
    default: new Date().toISOString(),
  },
});
module.exports = mongoose.model("Password", changePasswordSchema);
