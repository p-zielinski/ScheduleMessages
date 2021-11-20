const mongoose = require("mongoose");

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
  stripe_fuds_history: {
    type: Array,
    required: false,
    default: [],
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
  sending_messages_log: {
    type: Array,
    required: false,
    default: [],
  },
  sent_earlier: {
    type: Array,
    required: false,
    default: [],
  },
  stripe_customer_id: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("User", newUserSchema);
