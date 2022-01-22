const express = require('express');
const faker = require('faker');

const emojis = require('./emojis');
const { fake } = require('faker');
faker.seed(123);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const entries = require("./controller.js");

// Create a new Entry
router.post("/task/list", entries.create);

// Find a single Entry with an id
router.get("/task/list/:id", entries.findOne);

// Update a Entry by the id in the request
router.put("/task/list/:id", entries.update);

router.get('/task/random', (req, res) => {
  output = "";
  switch(Math.floor(Math.random() * 7)) {
    case 0:
      // Buy {product} from {company}
      output = `Buy ${faker.commerce.productName()} from ${faker.company.companyName()}`;
      break;
    case 1:
      // Meet {name}
      output = `Meet ${faker.name.firstName()}`;
      break;
    case 2:
      // Call {company} at {phone_number}
      output = `Call ${faker.company.companyName()} at ${faker.phone.phoneNumberFormat()}`;
      break;
    case 3:
      // Send an email to {name} at {email}
      output = `Send an email to ${faker.name.firstName()} at ${faker.internet.email()}`;
      break;
    case 4:
      // Send {amount} {currency} to {name} at {iban}
      output = `Send ${faker.finance.amount()} ${faker.finance.currencyCode()} to ${faker.name.firstName()} at ${faker.finance.iban()}`;
      break;
    case 5:
      // Buy tickets for a trip to {location} in {month}
      output = `Buy tickets for a trip to ${faker.address.city()} in ${faker.date.month()}`;
      break;
    default:
      // Pick up {first_name} {last_name} from {address}
      output = `Pick up ${faker.name.firstName()} ${faker.name.lastName()} from ${faker.address.streetAddress()}`;
  }
  res.json({
    message: output
  });
});

router.use('/emojis', emojis);

module.exports = router;
