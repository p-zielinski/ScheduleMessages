const stripeApi = require("./../utils/stripe");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getSessionDetails = async (req, res) => {
  //amount charged in cents
  const { token, sessionId } = req.body;
  let email;
  await jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      email = decoded.email;
    }
  });
  if (email === undefined) {
    return res.status(400).json({ error: "token is invalid" });
  }
  try {
    const session = await stripeApi.checkout.sessions.retrieve(sessionId);
    if (email === session.customer_details.email) {
      return res.status(200).json(session.amount_total);
    }
  } catch (e) {
    return res.status(400).json({ error: "an error occurred" });
  }
};

exports.createCheckoutSession = async (req, res) => {
  const domainUrl = process.env.WEB_APP_URL;
  const { line_items, token } = req.body;
  let email = undefined;
  await jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      email = decoded.email;
    }
  });
  if (email === undefined) {
    return res.status(400).json({ error: "token is invalid" });
  }
  if (!line_items) {
    return res
      .status(400)
      .json({ error: "missing required session parameters" });
  }
  let customerId;
  await User.findOne({ email: email })
    .then((user) => {
      customerId = user.stripe_customer_id;
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error: "User not found in DB" });
    });
  let session;
  try {
    session = await stripeApi.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "required",
      line_items,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
    });
    res.status(200).json({ sessionId: session.id });
  } catch (e) {
    res
      .status(400)
      .json({ error: "an error occured, unable to create session." });
    console.log(e);
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeApi.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEB_HOOK_SECRET
    );
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "charge.succeeded") {
    const session = event.data.object;
    const amount = session.amount;
    let email;
    try {
      email = session.billing_details.email;
    } catch (e) {
      email = undefined;
    }
    if (email === undefined) {
      await User.findOne({ stripe_user_id: session.customer })
        .then((user) => {
          email = user.email;
        })
        .catch((e) => console.log(e));
    }

    await User.findOneAndUpdate(
      { email: email },
      {
        $inc: { available_funds: amount },
        $push: {
          stripe_fuds_history: {
            transactionId: session.balance_transaction,
            created: session.created,
            amount: amount,
          },
        },
      }
    )
      .then(() => {})
      .catch((e) => console.log(e));
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};
