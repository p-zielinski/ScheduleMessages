const mongoose = require("mongoose");

const newIncomingSMS = mongoose.Schema({
  data: {
    type: Object,
    required: false,
  },
  date: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("IncomingSMS", newIncomingSMS);
