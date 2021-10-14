//db model schemas
const EmailValidation = require("./models/emailValidation");
const Message = require("./models/message");
const User = require("./models/user");
//app modules
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const sha256 = require("js-sha256");
const dotenv = require("dotenv");
const cors = require("cors");
//-------------------------------------------------
// const sessions = require('client-sessions')
//-------------------------------------------------
//functions
const checkExpiredEmailValidation = require("./modules/checkExpiredEmailValidation");
const {
  getJobs,
  scheduleAMessage,
  cancelAScheduledJob,
} = require("./modules/nodeSchedule");
const connectToDB = require("./modules/connectToDB");
const addScheduledMessagesFromDB = require("./modules/addScheduledMessagesFromDB");
//Body parser, middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
//import routes
const apiRoutes = require("./routes/api");
//routes middleware
app.use("/api", apiRoutes);
// const options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html'],
//   index: false,
//   maxAge: '1d',
//   redirect: false,
// }
// app.use(express.static('public', options))
//app variables
dotenv.config();
const PORT = process.env.PORT || 5000;
//process.exit(1);

const main = (async () => {
  if ((await connectToDB()) === false) {
    return `Connection with database has FAILED - app STOPPED`;
  } else console.log("Connection with database was ESTABLISHED - OK");
  const scheduledMessagesFromDB = await addScheduledMessagesFromDB();
  if (typeof scheduledMessagesFromDB === false) {
    return "Scheduling messages from DB have FAILED - app STOPPED";
  } else {
    console.log(`Scheduling messages from DB was SUCCESSFULLY completed`);
  }
  checkExpiredEmailValidation();
  api();
})();

const api = () => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
};
