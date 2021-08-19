const Message = require("../models/message");
const schedule = require("node-schedule");
const generateText = require("./generateText");

let jobs = {};

const getJobs = (id) =>{
    if(id===undefined){
        return jobs
    }
    if (jobs[id]===undefined){
        return false
    }
    return jobs[id]
}

const scheduleAMessage = async (data) => {
    let ruleOrDate;
    let message;
    if (data.addToDatabase === true) {
        message = new Message({
            ownerId: data.ownerId,
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
            Message.findById(message._id, (err, message) => {
                if(message){
                    Message.findByIdAndUpdate(message._id , { sent: [...message.sent, fakeMessage]}, (err, message) => {
                        if(message){
                            console.log(`Message id ${message._id} was updated`);
                        }
                        else{
                            //error
                        }
                    })
                }
                else{
                    //error
                }
            })
        }
    });
    if (job === null) {
        console.log(`message id ${message._id} has failed to be scheduled`);
        return false;
    } else {
        console.log(`message id ${message._id} was scheduled successfully`);
        jobs[message._id] = Object.assign({}, message._doc);
        jobs[message._id].job = job;
        return message;
    }
}

const scheduleFromDB = (message, args) => {
    let job = schedule.scheduleJob(args[0],args[1]);
    jobs[message._id] = Object.assign({}, message._doc);
    jobs[message._id].job = job;
    return message._id;
}

const cancelAScheduledJob = (messageId) => {
    const status = jobs[messageId].job.cancel();
    if(status===true){
        delete jobs[messageId]
    }
    return status
}

exports.getJobs = getJobs;
exports.scheduleAMessage = scheduleAMessage;
exports.scheduleFromDB = scheduleFromDB;
exports.cancelAScheduledJob = cancelAScheduledJob;
