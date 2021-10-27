const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const newUserSchema = mongoose.Schema({
  status: {
    type: String,
    required: false,
    default: "pending",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  messages: {
    type: Array,
    required: false,
    default: [],
  },
  available_funds: {
    type: Number,
    required: false,
    default: 0,
  },
  name: {
    type: String,
    required: false,
    default: "",
  },
  contact_list: {
    type: Array,
    required: false,
    default: [],
  },
  default_country: {
    type: String,
    required: false,
    default: "",
  },
  default_tz: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("User", newUserSchema);
