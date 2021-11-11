const User = require("../models/user");
const { scheduleAMessage } = require("./nodeSchedule");

const addScheduledMessagesFromDB = async () => {
  await User.find({ messages: { $not: { $size: 0 } } })
    .then((data) => {
      for (const user of data) {
        const messages = user.messages;
        for (const message of messages) {
          if (message.status === "active") {
            scheduleAMessage(user._id, message.data, message.uniqJobId);
          }
        }
      }
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

module.exports = addScheduledMessagesFromDB;
