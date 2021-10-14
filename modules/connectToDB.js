const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(
      // `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_USER_PASSWORD}@cluster0.8uapg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
      {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
      }
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = connectToDB;
