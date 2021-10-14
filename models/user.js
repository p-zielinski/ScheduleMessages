const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

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
    default: "pending",
  },
  available_funds: {
    type: Number,
    required: false,
  },
  update_key: {
    type: String,
    required: false,
    default: nanoid(24),
  },
});

module.exports = mongoose.model("User", newUserSchema);
