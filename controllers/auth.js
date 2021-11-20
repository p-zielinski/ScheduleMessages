const User = require("../models/user");
const EmailValidation = require("../models/emailValidation");
const ChangePasswordReq = require("../models/changePasswordReq");
const ChangeEmailReq = require("../models/changeEmailReq");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sha256 = require("js-sha256");
const { createJWT } = require("../utils/auth");
const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const nodemailer = require("nodemailer");
const {
  generateChangeEmailHtml,
} = require("../utils/generateHtml/generateChangeEmailReq");
const {
  generateConfirmEmailHtml,
} = require("../utils/generateHtml/generateConfirmEmail");
const {
  generateChangePasswordHtml,
} = require("../utils/generateHtml/generateChangePasswordReq");
const stripeApi = require("../utils/stripe");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "schedulemessages",
    pass: process.env.PRIVATE_GMAIL_APP_PASSCODE,
  },
});

const createCustomer = async (email) => {
  const customer = await stripeApi.customers.create({
    email: email,
  });
  return customer.id;
};

exports.change_email_final_step = async (req, res) => {
  let { email, secret_key, password, new_email } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "is missing";
  } else if (!emailRegexp.test(email) || email.length > 200) {
    errors.email = "invalid";
  }
  if (!secret_key) {
    errors.secret_key = "is missing";
  } else if (secret_key.length < 48) {
    errors.secret_key = "invalid";
  }
  if (!password) {
    errors.password = "is missing";
  } else if (password.length > 60 || password.length < 6) {
    errors.password = "invalid";
  }
  if (!new_email) {
    errors.email = "is missing";
  } else if (!emailRegexp.test(new_email) || new_email.length > 200) {
    errors.email = "invalid";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  await ChangeEmailReq.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.status(400).json({
        email: "incorrect",
      });
    }
    if (user.key !== secret_key) {
      return res.status(400).json({
        secret_key: "incorrect",
      });
    }
    User.findOne({ email: email })
      .then(async (userData) => {
        if (!userData) {
          return res.status(400).json({
            email: "incorrect",
          });
        } else {
          bcrypt
            .compare(
              await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password),
              userData.password
            )
            .then(async (isMatch) => {
              if (isMatch) {
                User.findOne({ email: new_email }).then((userDataNewEmail) => {
                  if (!userDataNewEmail) {
                    User.findOneAndUpdate(
                      { email: email },
                      { email: new_email },
                      { new: true }
                    )
                      .then(async (user) => {
                        let access_token = await createJWT(
                          user.email,
                          user._id,
                          3600
                        );
                        await ChangeEmailReq.findOneAndDelete({
                          email: email,
                        }).exec();
                        return res.status(200).json({
                          success: true,
                          token: access_token,
                          user: user._id,
                        });
                      })
                      .catch((err) => {
                        {
                          console.log(err);
                          res.status(400).json({
                            err,
                          });
                        }
                      });
                  } else {
                    return res.status(400).json({
                      new_email: "taken",
                    });
                  }
                });
              } else {
                return res.status(400).json({
                  password: "incorrect",
                });
              }
            })
            .catch((err) => {
              return res.status(400).json({
                password: "incorrect",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });
};

exports.change_email_req = async (req, res) => {
  const sendEmail = async (_email, _key, _hidden_email) => {
    await transporter.sendMail({
      from: '"Support@ScheduleMessages.com" <support@schedulemessages.com>', // sender address
      to: _email,
      subject: "Change your email address", // Subject line
      html: generateChangeEmailHtml(_email, _key, _hidden_email), // html body
    });
  };

  let { token } = req.body;
  let email;
  await jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      email = decoded.email;
    }
  });
  if (email === undefined) {
    return res.status(422).json({ token: "is invalid" });
  }
  await ChangeEmailReq.findOne({ email: email })
    .then(async (data) => {
      if (data !== null) {
        if (new Date() - new Date(data.last_time_sent) > 15000) {
          await ChangeEmailReq.findOneAndUpdate(
            { email: email },
            { last_time_sent: new Date().toISOString() }
          )
            .then((data) => {
              sendEmail(email, data.key, data.hidden_email);
              return res.status(200).json({
                success: true,
                email: data.email,
              });
            })
            .catch((err) =>
              res.status(500).json({
                err,
              })
            );
        } else {
          res.status(200).json({
            success: false,
            email: data.email,
            error: "sent within last 15 minutes",
          });
        }
      } else {
        new ChangeEmailReq({ email: email })
          .save()
          .then((data) => {
            sendEmail(email, data.key, data.hidden_email);
            return res.status(200).json({
              success: true,
              email: data.email,
            });
          })
          .catch((err) =>
            res.status(500).json({
              err,
            })
          );
      }
    })
    .catch((errors) => console.log(errors));
};

exports.change_password_final_step = async (req, res) => {
  let { email, secret_key, password } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "is missing";
  } else if (!emailRegexp.test(email) || email.length > 200) {
    errors.email = "invalid";
  }
  if (!secret_key) {
    errors.secret_key = "is missing";
  } else if (secret_key.length < 48) {
    errors.secret_key = "invalid";
  }
  if (!password) {
    errors.password = "is missing";
  } else if (password.length > 60 || password.length < 6) {
    errors.password = "invalid";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  await ChangePasswordReq.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.status(400).json({
        email: "incorrect",
      });
    }
    if (user.key !== secret_key) {
      return res.status(400).json({
        secret_key: "incorrect",
      });
    }
    bcrypt.hash(
      await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password),
      parseInt(process.env.SALT_ROUNDS),
      async function (err, hash) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "an error have occurred",
          });
        }
        password = hash;
        User.findOneAndUpdate({ email: email }, { password: password })
          .then(async (user) => {
            let access_token = await createJWT(user.email, user._id, 3600);
            await ChangePasswordReq.findOneAndDelete({ email: email }).exec();
            return res.status(200).json({
              success: true,
              token: access_token,
              user: user._id,
            });
          })
          .catch((err) => {
            {
              console.log(err);
              res.status(400).json({
                err,
              });
            }
          });
      }
    );
  });
};

exports.change_password_req = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.status(422).json({ email: "is missing" });
  } else {
    let emailUsed = false;
    await User.findOne({ email: email })
      .then((data) => {
        if (data === null) {
          res.status(422).json({ email: "not valid" });
        } else {
          emailUsed = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (!emailUsed) return 0;
    await ChangePasswordReq.findOne({ email: email })
      .then(async (data) => {
        if (data !== null) {
          if (new Date() - new Date(data.last_time_sent) > 15000) {
            await ChangePasswordReq.findOneAndUpdate(
              { email: email },
              { last_time_sent: new Date().toISOString() }
            )
              .then((data) => {
                const fnc = (async () => {
                  let info = await transporter.sendMail({
                    from: '"Support@ScheduleMessages.com" <support@schedulemessages.com>', // sender address
                    to: email,
                    subject: "Change your password", // Subject line
                    html: generateChangePasswordHtml(
                      email,
                      data.key,
                      data.hidden_email
                    ), // html body
                  });
                })();
                res.status(200).json({
                  success: true,
                  email: data.email,
                });
              })
              .catch((err) =>
                res.status(500).json({
                  err,
                })
              );
          } else {
            res.status(200).json({
              success: false,
              email: data.email,
              error: "sent within last 15 minutes",
            });
          }
        } else {
          new ChangePasswordReq({ email: email })
            .save()
            .then(async (data) => {
              const fnc = (async () => {
                let info = await transporter.sendMail({
                  from: '"Support@ScheduleMessages.com" <support@schedulemessages.com>', // sender address
                  to: email,
                  subject: "Change your password", // Subject line
                  html: generateChangePasswordHtml(
                    email,
                    data.key,
                    data.hidden_email
                  ), // html body
                });
                console.log(info);
              })();
              res.status(200).json({
                success: true,
                email: data.email,
              });
            })
            .catch((err) =>
              res.status(500).json({
                err,
              })
            );
        }
      })
      .catch((errors) => console.log(errors));
  }
};

exports.signup = async (req, res) => {
  let { email, password } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "required";
  } else if (!emailRegexp.test(email) || email.length > 200) {
    errors.email = "invalid";
  }
  if (!password || password.length > 60 || password.length < 6) {
    errors.password = "invalid";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  await User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        return res.status(422).json({ email: "already used" });
      } else {
        const user = new User({
          email: email,
          password: password,
        });
        bcrypt.hash(
          await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password),
          parseInt(process.env.SALT_ROUNDS),
          async function (err, hash) {
            if (err) console.log(err);
            user.password = hash;
            user
              .save()
              .then((response) => {
                new EmailValidation({ email: email })
                  .save()
                  .then((data) => {
                    const fnc = (async () => {
                      let info = await transporter.sendMail({
                        from: '"Support@ScheduleMessages.com" <support@schedulemessages.com>', // sender address
                        // from: '"ScheduleMessages@gmail.com" <schedulemessages@gmail.com>', // sender address
                        to: email,
                        subject: "Confirm your email", // Subject line
                        html: generateConfirmEmailHtml(
                          email,
                          data.key,
                          data.secret_email
                        ), // html body
                      });
                      console.log(info);
                    })();
                    res.status(200).json({
                      success: true,
                      email: response.email,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      err,
                    });
                  });
              })
              .catch((err) => {
                {
                  console.log(err);
                  res.status(500).json({
                    err,
                  });
                }
              });
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

exports.sign_in = (req, res) => {
  let { email, password } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "required";
  } else if (!emailRegexp.test(email) || email.length > 200) {
    errors.email = "invalid";
  }
  if (!password) {
    errors.password = "required";
  }
  if (password.length < 6 || password.length > 60) {
    errors.password = "invalid";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  User.findOne({ email: email })
    .then(async (user) => {
      if (!user) {
        return res.status(400).json({
          email: "incorrect",
        });
      } else {
        bcrypt
          .compare(
            await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password),
            user.password
          )
          .then(async (isMatch) => {
            if (!isMatch) {
              return res.status(422).json({ password: "incorrect" });
            }
            if (isMatch && user.status === "pending") {
              return res.status(422).json({ email: "not confirmed" });
            }
            let access_token = await createJWT(user.email, user._id, 3600);
            return res.status(200).json({
              success: true,
              token: access_token,
              user: user._id,
            });
          })
          .catch((err) => {
            res.status(500).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.check_email = (req, res) => {
  let { email } = req.body;
  if (!emailRegexp.test(email)) {
    return res.status(422).json({ email: "invalid" });
  }
  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        return res
          .status(200)
          .json({ available: false, email: email, status: user.status });
      } else {
        return res.status(200).json({ available: true, email: email });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: { error: "Something went wrong" },
      });
    });
};

exports.confirm_email = (req, res) => {
  let { email, activation_key, secret_email } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "required";
  } else if (!emailRegexp.test(email)) {
    errors.email = "invalid";
  }
  if (!activation_key) {
    errors.activation_key = "required";
  } else if (activation_key.length !== 24) {
    errors.activation_key = "invalid";
  }
  if (secret_email !== undefined) {
    EmailValidation.findOne({ secret_email: secret_email })
      .then(async (result) => {
        if (result.key === activation_key) {
          const stripe_customer_id = await createCustomer(result.email);
          User.findOneAndUpdate(
            { email: result.email },
            { status: "active", stripe_customer_id: stripe_customer_id }
          )
            .then(async (user) => {
              await EmailValidation.findOneAndDelete({
                secret_email: secret_email,
              })
                .then()
                .catch((err) => console.log(err));
              const access_token = createJWT(user.email, user._id, 3600);
              jwt.verify(
                access_token,
                process.env.TOKEN_SECRET,
                (err, decoded) => {
                  if (err) {
                    res.status(500).json({ err });
                  }
                  if (decoded) {
                    return res.status(200).json({
                      success: true,
                      token: access_token,
                      user: user._id,
                    });
                  }
                }
              );
            })
            .catch((err) => console.log(err));
        } else {
          return res.status(422).json({ secret_email: "invalid" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          secret_email: "invalid",
        });
      });
  } else if (
    errors.activation_key === undefined &&
    errors.email === undefined
  ) {
    EmailValidation.findOne({ email: email })
      .then(async (result) => {
        if (result.key === activation_key) {
          const stripe_user_id = await createCustomer(result.email);
          User.findOneAndUpdate(
            { email: email },
            { status: "active", stripe_user_id: stripe_user_id }
          )
            .then(async (user) => {
              await EmailValidation.findOneAndDelete({ email: email })
                .then()
                .catch((err) => console.log(err));
              const access_token = createJWT(user.email, user._id, 3600);
              jwt.verify(
                access_token,
                process.env.TOKEN_SECRET,
                (err, decoded) => {
                  if (err) {
                    res.status(500).json({ err });
                  }
                  if (decoded) {
                    return res.status(200).json({
                      success: true,
                      token: access_token,
                      user: user._id,
                    });
                  }
                }
              );
            })
            .catch((err) => console.log(err));
        } else {
          return res.status(422).json({ activation_key: "incorrect" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          email: "incorrect",
        });
      });
  } else {
    return res.status(422).json(errors);
  }
};

exports.is_token_valid = (req, res) => {
  let { token } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).json({ error });
    }
    if (decoded) {
      return res.status(200).json({
        valid: true,
      });
    }
  });
};

exports.extend_session = (req, res) => {
  let { token } = req.body;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).json({ error });
    }
    if (decoded) {
      console.log(decoded);
      const access_token = createJWT(decoded.email, decoded.userId, 3600);
      return res.status(200).json({
        success: true,
        token: access_token,
        user: decoded._id,
      });
    }
  });
};
