const IncomingSMS = require("../models/incomingSMS");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

exports.handleIncomingSMS = async (req, res) => {
  console.log(req);
  console.log(typeof req);
  new IncomingSMS({
    data: req,
  })
    .save()
    .then(async (data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      console.log("error adding new incomming sms to db");
    });
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(new MessagingResponse().toString());
};
