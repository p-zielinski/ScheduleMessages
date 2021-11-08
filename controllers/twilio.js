const IncomingSMS = require("../models/incomingSMS");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

exports.handleIncomingSMS = async (req, res) => {
  if (typeof req.body === "object") {
    new IncomingSMS({
      data: req.body,
    })
      .save()
      .then()
      .catch((error) => {
        console.log(error);
        console.log("error while adding new incoming sms to db");
      });
  }
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(new MessagingResponse().toString());
};
