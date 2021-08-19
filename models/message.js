const mongoose = require("mongoose");

const newScheduleAMessageSchema = mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  date_or_cron_or_rules: {
    //UTC
    //cron
    //second (0-59)|minute (0-59)|hour (0-23)|date (1-31)|month (0-11)|year|dayOfWeek (0-6) Starting with Sunday|tz
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: false,
    default: "",
  },
  endTime: {
    type: String,
    required: false,
    default: "",
  },
  phone_number: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  }, //-2/-1/0/1/2 - failed/canceled/scheduled/sent/sent but late
  sendIfTheServerWasDown: {
    type: Number,
    required: false,
    default: -1,
  }, // -1 means <DO NOT SEND> 0 means <SEND> >0 means <SEND ONLY IF LATE FOR X period of time>
  sent: {
    type: Array,
    required: false,
  },

});

module.exports = mongoose.model("Message", newScheduleAMessageSchema);
