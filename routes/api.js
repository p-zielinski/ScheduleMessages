const express = require("express");
const router = express.Router();
const {
  signup,
  sign_in,
  confirm_email,
  check_email,
  is_token_valid,
  change_password_req,
  extend_session,
  change_password_final_step,
  change_email_req,
  change_email_final_step,
} = require("../controllers/auth");
const {
  scheduleAMessageRequest,
  getUsersScheduledMessages,
  cancelAMessage,
} = require("../controllers/messages");
const {
  setContactList,
  getUserInfo,
  setName,
  setTimezone,
  getRealEmailChangePassword,
  getRealEmailChangeEmail,
} = require("../controllers/data");
const { handleIncomingSMS } = require("../controllers/twilio");
const {
  getSessionDetails,
  createCheckoutSession,
  webhook,
} = require("../controllers/stripe");

router.post("/signup", signup);
router.post("/sign_in", sign_in);
router.post("/confirm_email", confirm_email);
router.post("/check_email", check_email);
router.post("/is_token_valid", is_token_valid);
router.post("/change_password_req", change_password_req);
router.post("/change_password_final_step", change_password_final_step);
router.post("/change_email_req", change_email_req);
router.post("/change_email_final_step", change_email_final_step);
router.post("/extend_session", extend_session);

router.post("/get_messages", getUsersScheduledMessages);
router.post("/new_message", scheduleAMessageRequest);
router.post("/cancel_job", cancelAMessage);

router.post("/get_user_info", getUserInfo);
router.post("/set_name", setName);
router.post("/set_contact_list", setContactList);
router.post("/set_timezone", setTimezone);
router.post("/get_real_email_change_password", getRealEmailChangePassword);
router.post("/get_real_email_change_email", getRealEmailChangeEmail);

router.post("/incoming_sms", handleIncomingSMS);

router.post("/get_session_details", getSessionDetails);
router.post("/create_checkout_session", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

module.exports = router;
