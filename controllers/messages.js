const jwt = require("jsonwebtoken");
const { scheduleAMessage } = require("../modules/nodeSchedule");
const Message = require("../models/message");

exports.scheduleAMessageRequest = async (req, res) => {
  let { token, data } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) token = undefined;
    else if (decoded) token = decoded;
  });
  let errors = [];
  if (data === undefined) {
    errors.push({ data: "Invalid data" });
  }
  if (token === undefined) {
    errors.push({ token: "Invalid token, please login" });
  }
  if (errors.length > 0) {
    return res.status(422).json(errors);
  }
  const statusOrData = await scheduleAMessage(token.userId, data, true);
  if (statusOrData !== false) {
    if (typeof statusOrData === "object") {
      return res.status(200).json({
        success: true,
        result: `Success! A message was scheduled!`,
        messages: statusOrData.messages,
        newJobId: statusOrData.uniqJobId,
      });
    }
    return res.status(200).json({
      success: true,
      result: `Success! A message was scheduled!`,
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
