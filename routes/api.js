const express = require("express");
const router = express.Router();
const {
  signup,
  sign_in,
  confirm_email,
  check_email,
} = require("../controllers/auth");
const {
  scheduleAMessageRequest,
  getUsersScheduledMessages,
} = require("../controllers/messages");

router.post("/signup", signup);
router.post("/sign_in", sign_in);
router.post("/confirm_email", confirm_email);
router.post("/check_email", check_email);

router.post("/new_message", scheduleAMessageRequest);
router.post("/messages", getUsersScheduledMessages);

module.exports = router;
