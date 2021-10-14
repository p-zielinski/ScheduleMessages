const User = require("../models/user");
const EmailValidation = require("../models/emailValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sha256 = require("js-sha256");
const { createJWT } = require("../utils/auth");
const emailRegexp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
//
// const nodemailer = require("nodemailer");
//
// let transporter = nodemailer.createTransport({
//   //zmienic pozniej na moje dane
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "kaia45@ethereal.email", // generated ethereal user
//     pass: "Px2uhhVM1WGMgcAB5W", // generated ethereal password
//   },
// });

exports.signup = (req, res) => {
  let { email, password } = req.body;
  let errors = {};
  if (!email) {
    errors.email = "required";
  }
  if (!emailRegexp.test(email) || email.length > 200) {
    errors.email = "invalid";
  }
  if (!password || password.length > 60 || password.length < 6) {
    errors.password = "invalid";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  User.findOne({ email: email })
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
                      console.log(email + ":", data.key);
                      //zmienic
                      // let info = await transporter.sendMail({
                      //   from: "kaia45@ethereal.email", // sender address
                      //   to: "piotr@pipi.pl", // list of receivers - zmienic
                      //   subject: "Activation key", // Subject line
                      //   text: `Hello ${email}`, // plain text body
                      //   html: `Hello ${email}</br />your activation key is:<br />${data.key}`, // html body
                      // });
                      // if (info.messageId) {
                      //   console.log(
                      //     "Preview URL: %s",
                      //     nodemailer.getTestMessageUrl(info)
                      //   );
                      // }
                    })();
                    res.status(200).json({
                      success: true,
                      email: response.email,
                    });
                  })
                  .catch((err) =>
                    res.status(500).json({
                      err,
                    })
                  );
              })
              .catch((err) => {
                res.status(500).json({
                  err,
                });
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
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(422).json({ password: "incorrect" });
            }
            if (isMatch && user.status === "pending") {
              return res.status(422).json({ email: "not confirmed" });
            }
            let access_token = createJWT(user.email, user._id, 3600);
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
  let { email, activation_key } = req.body;
  console.log(email, activation_key, req.body);
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
  if (Object.keys(errors).length > 0) {
    console.log(errors);
    return res.status(422).json(errors);
  }
  console.log(email);
  EmailValidation.findOne({ email: email })
    .then((result) => {
      console.log(result);
      if (result.key === activation_key) {
        User.findOneAndUpdate({ email: email }, { status: "active" })
          .then(async (user) => {
            await EmailValidation.findOneAndDelete({ email: email })
              .then()
              .catch((err) => console.log(err));
            let access_token = createJWT(user.email, user._id, 3600);
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
};
