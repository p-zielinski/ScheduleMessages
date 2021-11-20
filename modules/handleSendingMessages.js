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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const english =
  "This message was sent from ScheduleMessages.com by one of our users. If you do not want to receive any more messages from this user, " +
  'please reply "STOP" at any time. In future messages from this user this information will not appear again. ' +
  "If you have a question, please contact us at the email address support@schedulemessages.com Thank you and have a wonderful day.";
const spanish =
  "Este mensaje fue enviado desde ScheduleMessages.com por uno de nuestros usuarios. " +
  'Si no desea recibir mas mensajes de este usuario, responda "STOP" en cualquier momento. ' +
  "En futuros mensajes de este usuario, esta informacion no aparecera nuevamente. Si tiene alguna pregunta, comuniquese con nosotros " +
  "en la direccion de correo electronico support@schedulemessages.com y tenga un maravilloso dia.";

const spanishISO = [
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
];
let smsPricing = [];
let firstTimeMessages = [];

(async () => {
  await fs
    .createReadStream("./smsData/ourSmsPricing.csv")
    .pipe(await csv())
    .on("data", async (data) => {
      data.Price = parseInt(data.Price);
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
    theMessage = theMessage.replace(/\ \ /g, " ");
  }
  while (theMessage.includes("\n\n\n")) {
    theMessage = theMessage.replace(/\n\n\n/g, "\n\n");
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
      try {
        person.msgPrice = smsPricing.find(
          (e) => e.ISO === person.country
        ).Price;
      } catch (e) {
        person.msgPrice = undefined;
      }
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
      }
      person.msgSegmentsCount = new SegmentedMessage(
        person.message
      ).segmentsCount;
      person.sent = false;
      if (person.msgPrice !== undefined) {
        totalCost += person.msgPrice * person.msgSegmentsCount;
        if (person.firstTimeMessage === true) {
          person.msgSegmentsCount += 3;
          totalCost += person.msgPrice * 3;
        }
      } else {
        totalCost = Infinity;
      }
    } else {
      person.valid = false;
    }
    while (person.message.includes("  ")) {
      person.message = person.message.replace(/\ \ /g, " ");
    }
    while (person.message.includes("\n\n\n")) {
      person.message = person.message.replace(/\n\n\n/g, "\n\n");
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
        .then(async (message) => {
          person.sent = message.dateCreated;
          person.messageSid = message.sid;
        });
      if (person.firstTimeMessage === true) {
        let fistTimeMessage;
        if (
          firstTimeMessages.find((e) => e.ISO === person.country) !== undefined
        ) {
          fistTimeMessage = firstTimeMessages.find(
            (e) => e.ISO === person.country
          ).Message;
        } else if (spanishISO.find((e) => e === person.country) !== undefined) {
          fistTimeMessage = spanish;
        } else {
          fistTimeMessage = english;
        }
        await sleep(100);
        await twilioClient.messages
          .create({
            body: fistTimeMessage,
            from: "+12244412200",
            to: person.number.replace(/\ /g, ""),
          })
          .then(async (message) => {
            person.FirstTimeMessage = {
              body: fistTimeMessage,
              sent: message.dateCreated,
              messageSid: message.sid,
            };
          });
      }
      await sleep(100);
    }
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { available_funds: -(totalCost * 100) },
        $push: {
          sending_messages_log: {
            data: simulateSending,
            uniqJobId: uniqJobId,
            totalCost: totalCost,
          },
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
          sending_messages_log: {
            data: simulateSending,
            uniqJobId: uniqJobId,
            error: "Not enough funds",
          },
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
