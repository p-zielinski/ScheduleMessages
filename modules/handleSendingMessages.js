const csv = require("csv-parser");
const fs = require("fs");
const { transliterate } = require("transliteration");
const { SegmentedMessage } = require("sms-segments-calculator");
const { parsePhoneNumber } = require("libphonenumber-js/mobile");
const User = require("../models/user");
const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const replaceDateFunctions = require("./messagesFunctions/replaceDateFunctions");
const replaceMyName = require("./messagesFunctions/replaceMyName");
const replaceRName = require("./messagesFunctions/replaceRName");
const chooseRandomly = require("./messagesFunctions/chooseRandomly");

let smsPricing = [];
let firstTimeMessages = [];

(async () => {
  await fs
    .createReadStream("./smsData/ourSmsPricing.csv")
    .pipe(await csv())
    .on("data", async (data) => {
      data.Price = parseFloat(data.Price);
      smsPricing.push(data);
    })
    .on("end", async () => {
      if (smsPricing.length > 0) {
        console.log("SMS prices were added correctly as a variable.");
      } else {
        console.log(
          "SMS prices could NOT be added, app will stop!\nCheck modules/handleSendingMessages.js"
        );
        process.exit(1);
      }
    });
})();

(async () => {
  await fs
    .createReadStream("./smsData/firstTimeInfo.csv")
    .pipe(await csv())
    .on("data", async (data) => {
      firstTimeMessages.push(data);
    })
    .on("end", async () => {
      if (firstTimeMessages.length > 0) {
        console.log("First time messages were added correctly as a variable.");
      } else {
        console.log(
          "First time messages could NOT be added, app will stop!\nCheck modules/handleSendingMessages.js"
        );
        process.exit(1);
      }
    });
})();

const handleSendingMessages = async (userId, data, uniqJobId) => {
  let sent_earlier = [];
  let errors = null;
  let currentUserName = "";
  let usersFunds = 0;
  await User.findOne({ _id: userId })
    .then(async (user) => {
      sent_earlier = user.sent_earlier;
      currentUserName = user.name;
      usersFunds = user.available_funds;
    })
    .catch((err) => {
      errors = err;
    });
  if (errors !== null) {
    console.log(errors);
    console.log(
      `Unable to find a user in DB, user id: ${userId}, message id ${uniqJobId} will not be sent`
    );
    return 0;
  }
  let theMessage = data.messageBody;
  theMessage = theMessage
    .replace(/<br>/g, "\n")
    .replace(/<br\W\/>/g, "\n")
    .replace(/<br\/>/g, "\n");
  while (theMessage.includes("  ")) {
    theMessage.replace(/\ \ /g, " ");
  }
  while (theMessage.includes("\n\n\n")) {
    theMessage.replace(/\n\n\n/g, "\n\n");
  }
  theMessage = await replaceDateFunctions(theMessage, data.timezone);
  theMessage = await replaceMyName(theMessage, currentUserName, data.name);
  let simulateSending = [];
  let totalCost = 0;
  for (let person of data.recipients) {
    person.number = person.number.replace(/\ /g, "");
    const temp_parsedPhoneNumber = parsePhoneNumber(person.number);
    if (temp_parsedPhoneNumber.isValid()) {
      person.firstTimeMessage = false;
      person.valid = true;
      person.country = temp_parsedPhoneNumber.country;
      person.msgPrice = smsPricing.find((e) => e.ISO === person.country).Price;
      person.message = chooseRandomly(theMessage);
      if (
        theMessage.includes("<r") ||
        theMessage.match(/<\Wr/) !== null ||
        theMessage.includes("<R") ||
        theMessage.match(/<\WR/) !== null
      ) {
        person.message = replaceRName(person.message, person.name);
      }
      if (
        sent_earlier.find((e) => e.replace(/\ /g, "") === person.number) ===
        undefined
      ) {
        sent_earlier.push(person.number);
        person.firstTimeMessage = true;
        person.message +=
          "\n\n" +
          firstTimeMessages.find((e) => e.ISO === person.country).Message;
      }
      if (data.allowExpensiveCharacters === false) {
        person.message = transliterate(person.message);
      }
      person.msgSegmentsCount = new SegmentedMessage(
        person.message
      ).segmentsCount;
      person.sent = false;
      totalCost += person.msgPrice * person.msgSegmentsCount;
    } else {
      person.valid = false;
    }
    simulateSending.push(person);
  }
  if (usersFunds >= totalCost) {
    for (let person of simulateSending) {
      await twilioClient.messages
        .create({
          body: person.message,
          from: "+12244412200",
          to: person.number.replace(/\ /g, ""),
        })
        .then((message) => {
          person.sent = message.dateCreated;
          person.messageSid = message.sid;
        });
    }
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { available_funds: -totalCost },
        $push: {
          sending_messages_log: { data: simulateSending, uniqJobId: uniqJobId },
        },
        sent_earlier: sent_earlier,
      },
      { new: true }
    )
      .then(async (user) => {})
      .catch((err) => {
        console.log(err);
        //yet do something....
        //save staff locally
      });
  } else {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          sending_messages_log: { data: simulateSending, uniqJobId: uniqJobId },
        },
      },
      { new: true }
    )
      .then(async (user) => {})
      .catch((err) => {
        console.log(err);
        //yet do something....
        //save staff locally
      });
  }
};

exports.handleSendingMessages = handleSendingMessages;
