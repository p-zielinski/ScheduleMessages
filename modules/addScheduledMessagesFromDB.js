const Message = require("../models/message");
const generateText = require("./generateText");
const {scheduleAMessage, scheduleFromDB} = require("./nodeSchedule");


const addScheduledMessagesFromDB = async () => {
    //local data loading?
    let status={
        scheduled : [],
        deliveredLate : [],
        failedToDeliver : []
    }
    let completed=false;
    await Message.find({ status: 0 })
        .then((messages) => {
            //downloading scheduled messages from the cloud
            for (let message of messages) {
                if (message.date_or_cron_or_rules.indexOf(":") !== -1) {
                    if (new Date(message.date_or_cron_or_rules) > new Date()) {
                        const messageId = scheduleFromDB(message, [message.date_or_cron_or_rules,
                            function () {
                                console.log(
                                    `Is ${
                                        message.date_or_cron_or_rules
                                    }, so I send a message: ${generateText(message.body)} to ${
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
                            }])
                        status.scheduled.push(messageId);
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
                                            message.body
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
                            status.deliveredLate.push(message._id);
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
                            status.failedToDeliver.push(message._id);
                        }
                    }
                } else {
                    scheduleAMessage(message);
                }
            }
            if (status.scheduled.length > 0)
                console.log(
                    `${
                        status.scheduled.length
                    } message(s) was/were scheduled:\n${status.scheduled.join(", ")}`
                );
            if (status.deliveredLate.length > 0)
                console.log(
                    `${
                        status.deliveredLate.length
                    } message(s) was/were delivered LATE:\n${status.deliveredLate.join(", ")}`
                );
            if (status.failedToDeliver.length > 0)
                console.log(
                    `${
                        status.failedToDeliver.length
                    } message(s) was/were TOO LATE to be delivered:\n${status.failedToDeliver.join(
                        ", "
                    )}`
                );
            completed = true
        })
        .catch();
    return completed?status:completed
}

module.exports = addScheduledMessagesFromDB;