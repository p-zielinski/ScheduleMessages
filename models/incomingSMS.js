const mongoose = require("mongoose");

const newIncomingSMS = mongoose.Schema({
  data: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("Message", newIncomingSMS);
