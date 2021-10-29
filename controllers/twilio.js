const User = require("../models/user");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

exports.handleIncomingSMS = async (req, res) => {
  console.log(req);
  await User.findOneAndUpdate(
    { _id: "617c353a3c31720016a0a6c0" },
    {
      $push: {
        messages: req,
      },
    },
    {
      new: true,
    }
  )
    .then(async (userData) => {
      console.log(userData);
    })
    .catch((error) => {
      console.log(error);
      console.log("error while getting user data");
    });
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(new MessagingResponse().toString());
};
