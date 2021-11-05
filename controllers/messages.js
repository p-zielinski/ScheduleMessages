const jwt = require("jsonwebtoken");
const {
  scheduleAMessage,
  cancelAScheduledJob,
} = require("../modules/nodeSchedule");
const User = require("../models/user");

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
      // if(data.saveTimezoneAsDefault)
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

exports.cancelAMessage = async (req, res) => {
  let { token, uniqJobId } = req.body;
  await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) token = undefined;
    else if (decoded) token = decoded;
  });
  let errors = [];
  if (token === undefined) {
    errors.push({ token: "invalid" });
  }
  if (uniqJobId === undefined) {
    errors.push({ uniqJobId: "invalid" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  } else {
    await User.findOne({ _id: token.userId })
      .then(async (data) => {
        let _messages = [];
        let updated = false;
        let canceled = false;
        for (let message of data.messages) {
          if (message.uniqJobId === uniqJobId) {
            if (message.status === "active") {
              message.status = "canceled";
            }
            updated = true;
            canceled = await cancelAScheduledJob(uniqJobId);
          }
          _messages.push(message);
        }
        if (updated === true && canceled === true) {
          await User.findOneAndUpdate(
            { _id: token.userId },
            { messages: _messages },
            { new: true }
          )
            .then((data) => {
              return res.status(200).json({
                success: true,
                result: `Success! A message was canceled!`,
                messages: data.messages,
              });
            })
            .catch((errors) => console.log(errors));
        } else {
          return res.status(422).json({ error: "Job was not canceled" });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(422).json({ errors: errors });
      });
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
