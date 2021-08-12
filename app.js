//app function
function scheduleAMessage(data) {
  let ruleOrDate
  let message;
  if (data.addToDatabase === true) {
    message = new Message({
      owner: data.owner,
      date_or_cron_or_rules: data.date_or_cron_or_rules,
      startTime: data.startTime,
      endTime: data.endTime,
      phone_number: data.phone_number,
      body: data.body,
      sendIfTheServerWasDown: data.sendIfTheServerWasDown,
    });
    message
      .save()
      // .then((data) => message)
      .then((data) => {
        message = data;
      })
      .catch((err) => {
        console.log(`error ${err}\nA message cannot be scheduled.`);
        return false;
      });
  } else {
    message = data;
  }

  if (message.date_or_cron_or_rules.indexOf("|") !== -1) {
    ruleOrDate = new schedule.RecurrenceRule();
    let tempIndex=0
    message.date_or_cron_or_rules.split("|").forEach(e => {
      if(tempIndex===7){
        ruleOrDate.tz=e
      }
      else{
        if(e.indexOf("+")===-1 && Number.isNaN(parseInt(e))===false){
          switch (tempIndex){
            case 0:
              ruleOrDate.second=parseInt(e);
              break;
            case 1:
              ruleOrDate.minute=parseInt(e);
              break;
            case 2:
              ruleOrDate.hour=parseInt(e);
              break;
            case 3:
              ruleOrDate.date=parseInt(e);
              break;
            case 4:
              ruleOrDate.month=parseInt(e);
              break;
            case 5:
              ruleOrDate.year=parseInt(e);
              break;
            default:
              ruleOrDate.dayOfWeek=parseInt(e);
              break;
          }
        }
        else if(e.indexOf("+")!==-1){
          e='['+e.replace('+','new schedule.Range(').replace('-',',')+')]'
          switch (tempIndex){
            case 0:
              ruleOrDate.second=eval(e);
              break;
            case 1:
              ruleOrDate.minute=eval(e);
              break;
            case 2:
              ruleOrDate.hour=eval(e);
              break;
            case 3:
              ruleOrDate.date=eval(e);
              break;
            case 4:
              ruleOrDate.month=eval(e);
              break;
            case 5:
              ruleOrDate.year=eval(e);
              break;
            default:
              ruleOrDate.dayOfWeek=eval(e);
              break;
          }
        }
      }
      tempIndex+=1
    })
  }
  else if (message.date_or_cron_or_rules.indexOf(" ") !== -1) {
    ruleOrDate = {}
    if (message.startTime !== "") {
      ruleOrDate.start = message.startTime;
    }
    if (message.endTime !== "") {
      ruleOrDate.end = message.endTime;
    }
    ruleOrDate.rule = message.date_or_cron_or_rules;
  }
  else {
    ruleOrDate = message.date_or_cron_or_rules;
  }
  console.log(ruleOrDate)
  const job = schedule.scheduleJob(ruleOrDate, function () {
    console.log(
      `Is so I send a message: ${generateText(message.body)} to ${
        message.phone_number
      }.`
    );
    if (typeof ruleOrDate === "string") {
      Message.findByIdAndUpdate(message._id, { status: 1 })
        .then((data) => {
          console.log(data);
          console.log(`Status of ${message._id} has been changed to 1`);
        })
        .catch((err) =>
          console.log(
            `unknown error while updating message status in mongoDB: ${err}`
          )
        );
    } else {
      Message.findById(message._id)
        .then((data) => {
          Message.findByIdAndUpdate(message._id, {
            sentXTimes: data.sentXTimes + 1,
          })
            .then(() => {
              console.log(
                `SentXTimes variable of ${message._id} has been changed to ${
                  data.sentXTimes + 1
                }`
              );
            })
            .catch((err) =>
              console.log(
                `unknown error while updating ${message._id} sentXTimes variable in mongoDB: ${err}`
              )
            );
        })
        .catch((err) =>
          console.log(
            `unknown error while getting ${message._id} message from mongoDB: ${err}`
          )
        );
    }
  });
  if (job === null) {
    console.log(`message id ${message._id} has failed to be scheduled`);
    return false;
  } else {
    console.log(`message id ${message._id} was scheduled successfully`);
    jobs[message._id] = Object.assign({}, message._doc);
    jobs[message._id].job = job;
    return message; //
  }
}
//db model schemas
const Message = require("./models/message");
//app modules
const express = require("express");
const app = express();
const generateText = require("./generateText");
const schedule = require("node-schedule");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
//Body parser, middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app variables
let jobs = {};
let backupStatusData = [];
//database
const mongoose = require("mongoose");
const connectToDB = (async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://user-0:V1JiY1MiyASVTnCu@cluster0.8uapg.mongodb.net/Schedule-messages?retryWrites=true&w=majority",
      {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to DB");
    await loadDataAndOverwriteCSVBackupStatusFile();
    let tempBackupStatusData = [];
    for (let record of backupStatusData) {
      Message.findByIdAndUpdate(record.messageId, { status: record.status })
        .then(() => {
          console.log(
            `Status of a message: ${record.messageId} was updated to ${record.status} in database`
          );
        })
        .catch((err) => {
          record.errorMessage = err;
          console.log(
            err.message +
              `\nError while updating However massage id ${record.messageId} in database\nHowever status will be saved in the CSV file and the variable`
          );
          tempBackupStatusData.push(record);
          addToCSVBackupStatusFile(
            record.messageId,
            record.status,
            record.owner,
            record.errorMessage
          );
          console.log(`Saving has been completed`);
        });
    }
    backupStatusData = [...tempBackupStatusData];
    checkCSVBackupStatusFileEvery60min();
    let scheduled = [];
    let deliveredLate = [];
    let failedToDeliver = [];
    await Message.find({ status: 0 })
      .then((data) => {
        //downloading scheduled messages from the cloud
        for (let message of data) {
          if (message.date_or_cron_or_rules.indexOf(":") !== -1) {
            if (new Date(message.date_or_cron_or_rules) > new Date()) {
              let job = schedule.scheduleJob(
                message.date_or_cron_or_rules,
                function () {
                  console.log(
                    `Is ${
                      message.date_or_cron_or_rules
                    }, so I send a message: ${generateText(message.text)} to ${
                      message.phone_number
                    }.`
                  );
                  Message.findByIdAndUpdate(message._id, { status: 1 })
                    .then(() =>
                      console.log(
                        `Status of ${message._id} has been changed to 1`
                      )
                    )
                    .catch((err) =>
                      console.log(
                        `Unknown error while updating message ${message._id} status to "1" in mongoDB: ${err}`
                      )
                    );
                }
              );
              jobs[message._id] = Object.assign({}, message._doc);
              jobs[message._id].job = job;
              scheduled.push(message._id);
            } else {
              //what to do if late?
              if (
                message.sendIfTheServerWasDown === 0 ||
                (message.sendIfTheServerWasDown <
                  (new Date() - new Date(message.date_or_cron_or_rules)) /
                    3600000 &&
                  message.sendIfTheServerWasDown !== -1)
              ) {
                Message.findByIdAndUpdate(message._id, { status: 2 })
                  .then(() => {
                    console.log(
                      `Status of ${message._id} has been changed to 2`
                    );
                    console.log(
                      `Sending ${message._id} message: "${generateText(
                        message.text
                      )}" to ${message.phone_number}, ${
                        Math.round(
                          ((new Date() - new Date(message.date)) / 3600000) *
                            100
                        ) / 100
                      } hours late`
                    );
                    //sending a message but late
                  })
                  .catch((err) =>
                    console.log(
                      `Unknown error while updating message ${message._id} status to "2" in mongoDB: ${err}`
                    )
                  );
                deliveredLate.push(message._id);
              } else {
                Message.findByIdAndUpdate(message._id, { status: -2 })
                  .then(() => {
                    console.log(
                      `Message ${message._id} have failed to be delivered`
                    );
                    console.log(
                      `Status of ${message._id} has been changed to -2`
                    );
                  })
                  .catch((err) =>
                    console.log(
                      `Unknown error while updating message ${message._id} status to "-2" in mongoDB: ${err}`
                    )
                  );
                failedToDeliver.push(message._id);
              }
            }
          } else {
            scheduleAMessage(message);
          }
        }
        if (scheduled.length > 0)
          console.log(
            `${
              scheduled.length
            } message(s) was/were scheduled:\n${scheduled.join(", ")}`
          );
        if (deliveredLate.length > 0)
          console.log(
            `${
              deliveredLate.length
            } message(s) was/were delivered LATE:\n${deliveredLate.join(", ")}`
          );
        if (failedToDeliver.length > 0)
          console.log(
            `${
              failedToDeliver.length
            } message(s) was/were TOO LATE to be delivered:\n${failedToDeliver.join(
              ", "
            )}`
          );
        api();
        console.log(`Scheduling messages have been completed successfully`);
      })
      .catch((error) => console.log(`Fatal error - ${error}`));
  } catch (error) {
    console.log(`Fatal error - ${error}`);
  }
})();

function checkCSVBackupStatusFileEvery60min() {
  console.log("Checking CSV Backup file...");
  setTimeout(async function () {
    await loadDataAndOverwriteCSVBackupStatusFile();
    tempBackupStatusData = [];
    for (let record of backupStatusData) {
      Message.findByIdAndUpdate(record.messageId, { status: -1 })
        .then(() => {
          console.log(
            `Status of a message: ${record.messageId} was updated to -1 in database`
          );
        })
        .catch((err) => {
          console.log(
            err.message +
              `\nError while updating However massage id ${record.messageId} in database\nHowever status will be saved in the CSV file and the variable`
          );
          tempBackupStatusData.push(record);
          addToCSVBackupStatusFile(
            record.messageId,
            record.status,
            record.owner,
            record.errorMessage
          );
          console.log(`Saving has been completed`);
        });
    }
    backupStatusData = [...tempBackupStatusData];
    checkCSVBackupStatusFileEvery60min();
  }, 3600000);
}

const loadDataAndOverwriteCSVBackupStatusFile = async () => {
  fs.createReadStream(
    path.resolve(__dirname, "localData", "backupStatusData.csv")
  )
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .on("data", (row) => {
      backupStatusData.push(row);
    })
    .on("end", () => {
      console.log(`Loaded from CSV file:`);
      console.log(backupStatusData);
      csv.writeToStream(
        fs.createWriteStream("localData/backupStatusData.csv"),
        [["messageId", "status", "owner", "errorMessage"]],
        {
          headers: false,
        }
      );
      console.log(`Overwriting CSV file have been completed`);
      return true;
    });
  return true;
};

const addToCSVBackupStatusFile = async (
  messageId,
  status,
  owner,
  errorMessage
) => {
  csv.writeToStream(
    fs.createWriteStream("localData/backupStatusData.csv", { flags: "a" }),
    [[""], [messageId, status, owner, errorMessage]],
    { headers: false }
  );
  return true;
};

const api = () => {
  //get info about a scheduled message
  app.get("/api/messages/:id", (req, res) => {
    Message.findById(req.params.id)
      .then((data) => {
        if (data === null) {
          res.send(`This id ${req.params.id} is not assign with any message`);
        } else {
          res.send(`${data}`);
        }
      })
      .catch((err) => {
        if (err.message.search("Cast") >= 0) {
          res.send(`This id ${req.params.id} is not assign with any message`);
        } else {
          res.send(
            `Unknown error while accessing a message in database: ${err.message}\nMessage id: ${req.params.id}`
          );
        }
      });
  });

  //add a new message to scheduler// trzeba dodac blad
  app.post("/api/messages", (req, res) => {

    if (new Date(req.body.date_or_cron_or_rules) < new Date() && req.body.date_or_cron_or_rules.indexOf(":")!==-1) {
      res.send(`Error! You have entered a past date!`);
    } else {
      const data = {
        addToDatabase: true,
        owner: "test1",
        date_or_cron_or_rules: req.body.date_or_cron_or_rules,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        phone_number: req.body.phone_number,
        body: req.body.body,
        //status: 0,
        sendIfTheServerWasDown: req.body.sendIfTheServerWasDown,
      };
      const status = scheduleAMessage(data, true);
      if (status !== false) {
        res.send(`Success! A message was scheduled!\n${status}`);
      } else {
        res.send("Error! A message was NOT scheduled!");
      }
    }
  });

  //cancel a scheduled messages
  app.post("/api/messages/cancel/:id", (req, res) => {
    Message.findById(req.params.id)
      .then((data) => {
        if (data === null) {
          res.send(`This id ${req.params.id} is not assign with any message`);
        } else if (data.status === 0) {
          Message.findByIdAndUpdate(req.params.id, { status: -1 })
            .then(() => {
              res.send(
                `A scheduled message id ${req.params.id} was canceled successfully`
              );
              jobs[req.params.id].job.cancel();
            })
            .catch((err) => {
              console.log(
                err.message +
                  `\nhowever a scheduled message id ${req.params.id} was canceled successfully`
              );
              addToCSVBackupStatusFile(req.params.id, -1);
              console.log(`Status was saved in CSV file`);
            });
        } else if (data.status === 1) {
          res.send(
            `A scheduled message id ${req.params.id} has been already sent`
          );
        } else {
          res.send(`A message id ${req.params.id} has been already canceled`);
        }
      })
      .catch((err) => {
        let found = false;
        for (let record of backupStatusData) {
          if (record.messageId === req.params.id) {
            found = true;
            break;
          }
        }
        if (found === true) {
          res.send(`A message id ${req.params.id} has been already canceled`);
        } else {
          if (err.message.search("Cast") >= 0) {
            res.send(`This id ${req.params.id} is not assign with any message`);
          } else {
            res.send(
              `Unknown error: ${err.message}\nMessage id: ${req.params.id}`
            );
          }
        }
      });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};
