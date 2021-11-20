//app modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
//functions
// const checkExpiredEmailValidation = require("./modules/checkExpiredEmailValidation");
const connectToDB = require("./modules/connectToDB");
const addScheduledMessagesFromDB = require("./modules/addScheduledMessagesFromDB");
const {
  checkExpiredEmailValidation,
  checkChangePasswordsKeysValidations,
} = require("./modules/checkDatabase");
//Body parser, middleware
app.use(express.urlencoded({ extended: false }));
//use json parser if not /api/webhook route
app.use((req, res, next) => {
  if (req.originalUrl === "/api/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
//import and use routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

if (process.env.NODE_ENV === "production") {
  const options = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["htm", "html"],
    index: false,
    maxAge: "1d",
    redirect: false,
  };
  app.use(express.static("client/build", options));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

dotenv.config();
const PORT = process.env.PORT || 5000;

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
  checkChangePasswordsKeysValidations();
  app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
})();
