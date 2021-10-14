const jwt = require("jsonwebtoken");
const { scheduleAMessage } = require("../modules/nodeSchedule");
const Message = require("../models/message");

exports.scheduleAMessageRequest = async (req, res) => {
  let {
    token,
    date_or_cron_or_rules,
    startTime,
    endTime,
    phone_numbers,
    body,
    sendIfTheServerWasDown,
  } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) token = undefined;
    else if (decoded) token = decoded;
  });
  let errors = [];
  if ((token = undefined)) {
    errors.push({ token: "Invalid token, please login" });
  }
  if (!date_or_cron_or_rules) {
    errors.push({ date_or_cron_or_rules: "required" });
  }
  if (!phone_numbers) {
    errors.push({ phone_numbers: "required" });
  }
  if (!body) {
    errors.push({ body: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  const status = await scheduleAMessage({
    addToDatabase: true,
    ownerId: token.userId,
    date_or_cron_or_rules: date_or_cron_or_rules,
    startTime: startTime,
    endTime: endTime,
    phone_number: phone_numbers,
    body: body,
    sendIfTheServerWasDown: sendIfTheServerWasDown,
  });
  if (status !== false) {
    return res.status(200).json({
      success: true,
      result: `Success! A message was scheduled!\n${status}`,
    });
  } else {
    return res
      .status(422)
      .json({ error: "Error! A message was NOT scheduled!" });
  }
};

exports.getUsersScheduledMessages = async (req, res) => {
  let { token } = req.body;
  await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) token = undefined;
    else if (decoded) token = decoded;
  });
  let errors = [];
  if (token === undefined) {
    errors.push({ token: "invalid" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  } else {
    Message.find({ ownerId: token.userId }, (err, messages) => {
      if (err) {
        return res.status(422).json({ errors: err });
      } else {
        return res.status(200).json({
          success: true,
          result: messages,
        });
      }
    });
  }
};
