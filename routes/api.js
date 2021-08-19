const express = require('express');
const router = express.Router();
const { signup, signin, confirm_email } = require('../controllers/auth');
const { scheduleAMessageRequest } = require('../controllers/messages');



router.post('/signup', signup);
router.post('/signin', signin);
router.post('/confirm_email', confirm_email);

router.post('/new_message', scheduleAMessageRequest);

module.exports = router;