const schedule = require("node-schedule");
const dotenv = require("dotenv");
const generateText = require("./generateText");
const moment = require("moment-timezone");
const { nanoid } = require("nanoid");
const User = require("../models/user");

const { handleSendingMessages } = require("./handleSendingMessages");

let jobs = {};

const handleChangeMessageStatus = (userId, uniqJobId, status) => {
  User.findOne({ _id: userId })
    .then((userData) => {
      const messages = [];
      for (let message of userData.messages) {
        if (message.uniqJobId === uniqJobId) {
          message.status = status;
        }
        messages.push(message);
      }
      User.findOneAndUpdate({ _id: userId }, { messages: messages })
        .then((userData) => console.log(`job #${uniqJobId} completed`))
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
      console.log("error while getting user data");
    });
};

const scheduleAMessage = async (userId, data, uniqJobIdIfFromDB) => {
  let uniqJobId = Date.now() + nanoid();
  if (typeof uniqJobIdIfFromDB === "string") {
    uniqJobId = uniqJobIdIfFromDB;
  }
  let job = null;
  if (data.isSingleTime === "recurring") {
    const startDate = data.timeRange[0].split("-");
    const rule = new schedule.RecurrenceRule();
    rule.minute = parseInt(data.at[1]);
    rule.hour = parseInt(data.at[0]);
    rule.tz = data.timezone;
    // if (typeof uniqJobIdIfFromDB) {
    const testingNow = moment().tz(data.timezone);
    testingNow.set("minute", parseInt(data.at[1]));
    testingNow.set("hour", parseInt(data.at[0]));
    testingNow.set("year", parseInt(startDate[0]));
    testingNow.set("month", parseInt(startDate[1]) - 1);
    testingNow.set("date", parseInt(startDate[2]));
    if (moment().tz(data.timezone).isAfter(testingNow) === true) {
      const endDate = data.timeRange[1].split("-");
      testingNow.set("year", parseInt(endDate[0]));
      testingNow.set("month", parseInt(endDate[1]) - 1);
      testingNow.set("date", parseInt(endDate[2]));
      if (moment().tz(data.timezone).isBefore(testingNow) === true) {
        let foundTheStartingDay = false;
        testingNow.set("year", parseInt(startDate[0]));
        testingNow.set("month", parseInt(startDate[1]) - 1);
        testingNow.set("date", parseInt(startDate[2]));
        while (!foundTheStartingDay) {
          testingNow.add(1, "days");
          if (moment().tz(data.timezone).isBefore(testingNow) === true) {
            foundTheStartingDay = true;
          }
        }
        rule.year = parseInt(testingNow.format("YYYY"));
        rule.month = parseInt(testingNow.format("M")) - 1;
        rule.date = parseInt(testingNow.format("D"));
      } else {
        console.log(
          `Message id ${uniqJobId} has been completed... updating in Db`
        );
        handleChangeMessageStatus(userId, uniqJobId, "completed");
        return false;
      }
      // }
    } else {
      rule.year = parseInt(startDate[0]);
      rule.month = parseInt(startDate[1]) - 1;
      rule.date = parseInt(startDate[2]);
    }
    job = schedule.scheduleJob(rule, function () {
      scheduleAMessageEveryday(userId, data, uniqJobId);
      const now = moment().tz(data.timezone);
      let deliverNow = false;
      if (data.deliverEvery === "day") deliverNow = true;
      else if (data.deliverEvery === "week") {
        for (let e of data.weekDays) {
          if (parseInt(e) === now.isoWeekday()) {
            deliverNow = true;
            break;
          }
        }
      } else if (data.deliverEvery === "month") {
        if (data.reverseMonth === true) {
          const totalNumberOfDaysInThisMonth = new Date(
            now.format("YYYY"),
            now.format("M"),
            0
          ).getDate();
          for (let e of data.monthDays) {
            if (
              now.format("D") ===
              totalNumberOfDaysInThisMonth - parseInt(e)
            ) {
              deliverNow = true;
              break;
            }
          }
        } else {
          for (let e of data.monthDays) {
            if (e === now.format("D")) {
              deliverNow = true;
              break;
            }
          }
        }
      } else if (data.deliverEvery === "year") {
        for (let e of data.yearDays) {
          if (e === now.format("MM-DD")) {
            deliverNow = true;
            break;
          }
        }
      }
      if (deliverNow === true) {
        handleSendingMessages(userId, data, uniqJobId);
      }
    });
  } else if (data.isSingleTime === "single") {
    const rule = new schedule.RecurrenceRule();
    rule.minute = parseInt(data.at[1]);
    rule.hour = parseInt(data.at[0]);
    const startDate = data.date.split("-");
    rule.year = parseInt(startDate[0]);
    rule.month = parseInt(startDate[1]) - 1;
    rule.date = parseInt(startDate[2]);
    rule.tz = data.timezone;
    job = schedule.scheduleJob(rule, function () {
      handleSendingMessages(userId, data, uniqJobId);
      handleChangeMessageStatus(userId, uniqJobId, "completed");
    });
  }
  if (job === null) {
    if (typeof uniqJobIdIfFromDB === "string") {
      console.log(
        `Message id ${uniqJobId} has been completed... updating in Db`
      );
      handleChangeMessageStatus(userId, uniqJobId, "completed");
    } else {
      console.log(
        `message id ${uniqJobId} has failed to be scheduled; type: ${data.isSingleTime}`
      );
    }
    return false;
  } else {
    let messagesHolder = null;
    console.log(`message id ${uniqJobId} was scheduled successfully`);
    jobs[uniqJobId] = { data: data, job: null };
    jobs[uniqJobId].job = job;
    if (typeof uniqJobIdIfFromDB !== "string") {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            messages: { data: data, uniqJobId: uniqJobId, status: "active" },
          },
        },
        {
          new: true,
        }
      )
        .then(async (userData) => {
          messagesHolder = userData.messages;
        })
        .catch((error) => {
          console.log(error);
          console.log("error while getting user data");
        });
      if (messagesHolder !== null) {
        return { messages: messagesHolder, uniqJobId: uniqJobId };
      }
      return uniqJobId;
    } else return true;
  }
};

const scheduleAMessageEveryday = async (userId, data, uniqJobId) => {
  let job = null;
  const rule = new schedule.RecurrenceRule();
  rule.minute = parseInt(data.at[1]);
  rule.hour = parseInt(data.at[0]);
  rule.tz = data.timezone;
  job = schedule.scheduleJob(rule, function () {
    const now = moment().tz(data.timezone);
    let deliverNow = false;
    if (data.deliverEvery === "day") deliverNow = true;
    else if (data.deliverEvery === "week") {
      for (let e of data.weekDays) {
        if (parseInt(e) === now.isoWeekday()) {
          deliverNow = true;
          break;
        }
      }
    } else if (data.deliverEvery === "month") {
      if (data.reverseMonth === true) {
        const totalNumberOfDaysInThisMonth = now.daysInMonth();
        for (let e of data.monthDays) {
          if (now.format("D") === totalNumberOfDaysInThisMonth - parseInt(e)) {
            deliverNow = true;
            break;
          }
        }
      } else {
        for (let e of data.monthDays) {
          if (e === now.format("D")) {
            deliverNow = true;
            break;
          }
        }
      }
    } else if (data.deliverEvery === "year") {
      for (let e of data.yearDays) {
        if (e === now.format("MM-DD")) {
          deliverNow = true;
          break;
        }
      }
    }
    if (deliverNow === true) {
      handleSendingMessages(userId, data, uniqJobId);
    }
    const copyNow = moment(now);
    copyNow.set("year", data.timeRange[1].split("-")[0]);
    copyNow.set("month", parseInt(data.timeRange[1].split("-")[1]) - 1);
    copyNow.set("date", data.timeRange[1].split("-")[2]);
    if (now.isSameOrAfter(copyNow) === true) {
      jobs[uniqJobId].job.cancel();
      handleChangeMessageStatus(userId, uniqJobId, "completed");
    }
  });
  if (job !== null) {
    setTimeout(async function () {
      await jobs[uniqJobId].job.cancel();
      jobs[uniqJobId].job = job;
      console.log("message successfully re-scheduled");
    }, 30000);
    return true;
  } else {
    console.log("message failed to be schedule further");
    return false;
  }
};

const cancelAScheduledJob = (uniqJobId) => {
  const status = jobs[uniqJobId].job.cancel();
  if (status === true) {
    delete jobs[uniqJobId];
  }
  return status;
};

exports.scheduleAMessage = scheduleAMessage;
exports.cancelAScheduledJob = cancelAScheduledJob;
