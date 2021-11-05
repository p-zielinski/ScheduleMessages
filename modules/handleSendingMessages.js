const { transliterate } = require("transliteration");
const { SegmentedMessage } = require("sms-segments-calculator");
const { parsePhoneNumber } = require("libphonenumber-js/mobile");
const User = require("../models/user");
const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const handleSendingMessages = async (userId, data, uniqJobId) => {
  let willSend = false;
  let theMessage = data.messageBody + " ";
  while (theMessage.includes("  ")) {
    theMessage.replace(/\ \ /g, " ");
  }
  theMessage += data.messageEnds;
  if (data.allowExpensiveCharacters === false) {
    theMessage = transliterate(theMessage);
  }
  const theMessageLength = new SegmentedMessage(theMessage).segmentsCount;
  let totalCost = 0;
  for (let person of data.recipients) {
    const number = parsePhoneNumber(person.number);
    if (number.isValid()) {
      person.valid = true;
    } else person.valid = false;
    person.country = number.country;
    if (
      (person.country === "US" || person.country === "CA") &&
      person.valid === true
    ) {
      totalCost += theMessageLength * 0.1;
    } else if (person.valid === true) {
      totalCost += theMessageLength * 0.2;
    }
  }
  await User.findOne({ _id: userId })
    .then((data) => {
      if (data.available_funds >= totalCost) {
        willSend = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (willSend === true) {
    let sentTo = [];
    let allMessages = [];
    for (let person of data.recipients) {
      if (person.valid === true) {
        twilioClient.messages
          .create({
            body: theMessage,
            from: "+12244412200",
            to: person.number.replace(/\ /g, ""),
          })
          .then((message) => {
            console.log(message.sid);
            allMessages.push({
              sid: message.sid,
              date_sent: message.date_sent,
              to: message.to,
              num_segments: message.num_segments,
            });
            sentTo.push(person.number.replace(/\ /g, ""));
          });
      }
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            sending_messages_log: {
              data: allMessages,
              uniqJobId: uniqJobId,
              status: "Sent",
            },
          },
        }
      )
        .then(async (userData) => {
          //do nothing?
        })
        .catch((error) => {
          console.log(error);
          console.log("error while getting user data");
        });
    }
  } else {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          sending_messages_log: {
            data: {},
            uniqJobId: uniqJobId,
            status: "Insufficient funds to send messages",
          },
        },
      }
    )
      .then(async (userData) => {
        //do nothing?
      })
      .catch((error) => {
        console.log(error);
        console.log("error while getting user data");
      });
  }
};

exports.handleSendingMessages = handleSendingMessages;
