const express = require("express");
const router = express.Router();
const {
  signup,
  sign_in,
  confirm_email,
  check_email,
  is_token_valid,
} = require("../controllers/auth");
const {
  scheduleAMessageRequest,
  getUsersScheduledMessages,
} = require("../controllers/messages");
const { setContactList, getUserInfo, setName } = require("../controllers/data");

router.post("/signup", signup);
router.post("/sign_in", sign_in);
router.post("/confirm_email", confirm_email);
router.post("/check_email", check_email);
router.post("/is_token_valid", is_token_valid);

router.post("/get_messages", getUsersScheduledMessages);
router.post("/new_message", scheduleAMessageRequest);

router.post("/get_user_info", getUserInfo);
router.post("/set_name", setName);
router.post("/set_contact_list", setContactList);

module.exports = router;
