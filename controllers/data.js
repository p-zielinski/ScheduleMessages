const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ChangePasswordReq = require("../models/changePasswordReq");
const ChangeEmailReq = require("../models/changeEmailReq");

exports.getRealEmailChangeEmail = async (req, res) => {
  let { hidden_email } = req.body;
  await ChangeEmailReq.findOne({ hidden_email: hidden_email })
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          hidden_email: "not found",
        });
      }
      return res.status(200).json({
        email: data.email,
      });
    })
    .catch((e) => {
      return res.status(400).json({
        error: "an error has occurred",
      });
    });
};

exports.getRealEmailChangePassword = async (req, res) => {
  let { hidden_email } = req.body;
  await ChangePasswordReq.findOne({ hidden_email: hidden_email })
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          hidden_email: "not found",
        });
      }
      return res.status(200).json({
        email: data.email,
      });
    })
    .catch((e) => {
      return res.status(400).json({
        error: "an error has occurred",
      });
    });
};

exports.setTimezone = (req, res) => {
  let { token, default_country, default_tz } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(400).json({ error: "token invalid" });
    }
    if (decoded) {
      User.findOneAndUpdate(
        { _id: decoded.userId },
        { default_country: default_country, default_tz: default_tz },
        { new: true }
      )
        .then(async (user) => {
          return res.status(200).json({
            default_country: user.default_country,
            default_tz: user.default_tz,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error,
          });
        });
    }
  });
};

exports.getUserInfo = (req, res) => {
  let { token } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).json({ error });
    }
    if (decoded) {
      User.findOne({ _id: decoded.userId })
        .then(async (user) => {
          return res.status(200).json({
            stripe_user_id: user.stripe_user_id,
            sending_messages_log: user.sending_messages_log,
            sent_earlier: user.sent_earlier,
            messages: user.messages,
            available_funds: user.available_funds,
            name: user.name,
            contact_list: user.contact_list,
            default_country: user.default_country,
            default_tz: user.default_tz,
            message_ends_custom_options: user.message_ends_custom_options,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error,
          });
        });
    }
  });
};

exports.setContactList = (req, res) => {
  let { token, contact_list } = req.body;
  if (!contact_list) {
    res.status(500).json({
      error: "Contact list is missing",
    });
    return 0;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).json({ error });
    }
    if (decoded) {
      User.findOneAndUpdate(
        { _id: decoded.userId },
        { contact_list: contact_list }
      )
        .then(async (user) => {
          User.findOne({ _id: decoded.userId })
            .then(async (user) => {
              return res.status(200).json({
                contact_list: user.contact_list,
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error,
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error,
          });
        });
    }
  });
};

exports.setName = (req, res) => {
  let { token, name } = req.body;
  console.log(name, typeof name);
  if (typeof name !== "string") {
    res.status(500).json({
      error: "Name is missing",
    });
    return 0;
  }
  if (name.length === 1) {
    res.status(500).json({
      error: "Name is too short",
    });
    return 0;
  }
  if (name.length > 16) {
    res.status(500).json({
      error: "Name is too long",
    });
    return 0;
  }
  if (name.length > 16) {
    res.status(500).json({
      error: "Name is too long",
    });
    return 0;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).json({ error });
    }
    if (decoded) {
      User.findOneAndUpdate({ _id: decoded.userId }, { name: name })
        .then(async () => {
          User.findOne({ _id: decoded.userId })
            .then(async (user) => {
              return res.status(200).json({
                name: user.name,
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error,
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error,
          });
        });
    }
  });
};
