//db model schemas
const EmailValidation = require('./models/emailValidation');
const Message = require("./models/message");
const User = require('./models/user');
//app modules
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const sha256 = require('js-sha256');
const dotenv = require('dotenv');
const cors = require('cors')
//-------------------------------------------------
// const sessions = require('client-sessions')
//-------------------------------------------------
//functions
const checkExpiredEmailValidation  = require("./modules/checkExpiredEmailValidation");
const {getJobs , scheduleAMessage, cancelAScheduledJob} = require("./modules/nodeSchedule");
const connectToDB = require("./modules/connectToDB");
const addScheduledMessagesFromDB = require("./modules/addScheduledMessagesFromDB");
//Body parser, middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//import routes
const apiRoutes = require('./routes/api');
//routes middleware
app.use('/api', apiRoutes);
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
  if(await connectToDB()===false){
    return `Connection with database has FAILED - app STOPPED`
  } else console.log('Connection with database was ESTABLISHED - OK')
  const scheduledMessagesFromDB = await addScheduledMessagesFromDB();
  if(typeof scheduledMessagesFromDB===false){
    return 'Scheduling messages from DB have FAILED - app STOPPED'
  } else{
    console.log(`Scheduling messages from DB was SUCCESSFULLY completed`)
  }
  checkExpiredEmailValidation();
  api();
})()


const api = () => {
  //schedule a message
  app.post("/message.html", async (req, res) => {

    if (new Date(req.body.date_or_cron_or_rules) < new Date() && req.body.date_or_cron_or_rules.indexOf(":")!==-1) {
      res.send(`Error! You have entered a past date!`);
    } else {
      const data = {
        addToDatabase: true,
        ownerId: "611a3e6d58fc0a8de9df070c",
        date_or_cron_or_rules: req.body.date_or_cron_or_rules,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        phone_number: req.body.phone_number,
        body: req.body.body,
        sendIfTheServerWasDown: req.body.sendIfTheServerWasDown,
      };
      const status = scheduleAMessage(data);
      if (status !== false) {
        res.send(`Success! A message was scheduled!\n${status}`);
      } else {
        res.send("Error! A message was NOT scheduled!");
      }
    }
  });

  //message info or cancel if "&cancel=true"
  app.get("/api/message", (req, res) => {
    if(!req.query.key||!req.query.message){
      res.send(`invalid query`)
    }
    else{
      let cancel;
      let remove;
      if(req.query.cancel==='true') cancel=true;
      if(req.query.remove==='true') remove=true;
      Message.findById(req.query.message, async (err, message) => {
        if(message){
          User.findById(message.ownerId, async (err, user) => {
            if(user.keyToMessages===req.query.key){
              if(remove===true){
                await Message.findOneAndDelete({ id: req.query.message }, async (err, message) => {
                  if(err){
                    res.send(message)
                  }
                  else{
                    //send to nodeScheduler query
                    if(getJobs(message._id)){
                      cancelAScheduledJob(message._id)
                      res.send(`canceled and removed:\n` + message)
                    }
                  }
                })
              }
              else if(cancel===true){
                if(getJobs(message._id)){
                  cancelAScheduledJob(message._id)
                  await Message.findOneAndUpdate({ id: req.query.message },{ status:-1 } , async (err, message) => {
                    if(err){
                      res.send(message)
                    }
                    else{
                      res.send(`canceled:\n` + message)
                    }
                  })
                }else{
                  res.send(`invalid query`)
                }
              }
              else res.send(message)
            }
            else res.send(`invalid query`)
          })
        }
        else res.send(`invalid query`)
      })
    }
  })


  app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
};