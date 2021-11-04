const EmailValidation = require("../models/emailValidation");
const User = require("../models/user");
const ChangePasswordReq = require("../models/changePasswordReq");

let indexCheckingEmailValidation = 0;
let indexCheckingPasswordKeys = 0;

exports.checkExpiredEmailValidation = async () => {
  if (indexCheckingEmailValidation === 0) {
    console.log(
      "Scanning users with not confirmed email addresses (within first 2 days) INITIALIZED"
    );
  }
  setTimeout(async function () {
    indexCheckingEmailValidation += 1;
    console.log(
      `checking emails if confirmed within 2 days: ${indexCheckingEmailValidation}`
    );
    EmailValidation.find(
      {
        expires: {
          $lt: new Date().toISOString(),
        },
      },
      async (err, emails) => {
        if (emails.length === 0) {
          console.log("checking completed - no record fined");
        } else if (emails) {
          console.log(emails);
          for (const email of emails) {
            await User.findOne(
              { email: email.email },
              async (err, userData) => {
                if (userData) {
                  if (userData.status === "pending") {
                    let progress = 0;
                    await User.findOneAndDelete({ email: email.email })
                      .then((progress += 1))
                      .catch((err) => console.log(err));
                    await EmailValidation.findOneAndDelete({ _id: email._id })
                      .then((progress += 1))
                      .catch((err) => console.log(err));
                    if (progress !== 2) {
                      console.log(
                        `error while deleting email "${email.email}" from DB `
                      );
                    } else {
                      console.log(`email "${email.email}" was deleted from DB`);
                    }
                  } else {
                    await EmailValidation.findOneAndDelete({
                      _id: email._id,
                    }).catch((err) => console.log(err));
                  }
                } else if (err) {
                  console.log(`${err} while checking emails status`);
                }
              }
            );
          }
          console.log("Checking completed");
        } else if (err) {
          console.log(`Error: ${err}\nWhile checking email expiration date`);
        }
      }
    );
    checkExpiredEmailValidation();
  }, 3600000);
};

exports.checkChangePasswordsKeysValidations = async () => {
  if (indexCheckingPasswordKeys === 0) {
    console.log(`Scanning "change passwords" secret keys INITIALIZED`);
  }
  setTimeout(async function () {
    indexCheckingPasswordKeys += 1;
    console.log(
      `checking change passwords secret keys if they are still valid: ${indexCheckingPasswordKeys}`
    );
    await ChangePasswordReq.find(
      {
        expires: {
          $lt: new Date().toISOString(),
        },
      },
      async (err, emails) => {
        if (emails.length === 0) {
          console.log("checking completed - no record fined");
        } else if (emails) {
          for (const email of emails) {
            await ChangePasswordReq.findOneAndDelete(
              { email: email.email },
              async (err, passwordData) => {
                if (passwordData) {
                  console.log(
                    `deleting change password secret key for: ${passwordData.email}`
                  );
                } else if (err) {
                  console.log(`${err} while checking emails status`);
                }
              }
            );
          }
          console.log("Checking completed");
        } else if (err) {
          console.log(
            `Error: ${err}\nWhile checking passwords secret keys validations`
          );
        }
      }
    );
    checkChangePasswordsKeysValidations();
  }, 3600000);
};
