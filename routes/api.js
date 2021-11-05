const express = require("express");
const router = express.Router();
const {
  signup,
  sign_in,
  confirm_email,
  check_email,
  is_token_valid,
  change_password_req,
} = require("../controllers/auth");
const {
  scheduleAMessageRequest,
  getUsersScheduledMessages,
  cancelAMessage,
} = require("../controllers/messages");
const { setContactList, getUserInfo, setName } = require("../controllers/data");
const { handleIncomingSMS } = require("../controllers/twilio");

router.post("/signup", signup);
router.post("/sign_in", sign_in);
router.post("/confirm_email", confirm_email);
router.post("/check_email", check_email);
router.post("/is_token_valid", is_token_valid);
router.post("/change_password_req", change_password_req);

router.post("/get_messages", getUsersScheduledMessages);
router.post("/new_message", scheduleAMessageRequest);
router.post("/cancel_job", cancelAMessage);

router.post("/get_user_info", getUserInfo);
router.post("/set_name", setName);
router.post("/set_contact_list", setContactList);

router.get("/incoming_sms", handleIncomingSMS);

module.exports = router;
