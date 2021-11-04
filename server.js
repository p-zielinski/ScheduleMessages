//app modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const secure = require("express-force-https");
//functions
const checkExpiredEmailValidation = require("./modules/checkExpiredEmailValidation");
const connectToDB = require("./modules/connectToDB");
const addScheduledMessagesFromDB = require("./modules/addScheduledMessagesFromDB");
//Body parser, middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(secure);
// app.use(cors());
//import routes
const apiRoutes = require("./routes/api");
//routes middleware
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
