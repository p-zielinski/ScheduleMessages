const stripeAPI = require("stripe")(process.env.STRIPE_SECRET);

module.exports = stripeAPI;
