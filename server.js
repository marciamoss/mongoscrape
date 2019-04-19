const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3003;

// Initialize Express
const app = express();

// Configure middleware

// Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Import routes and give the server access to them.
app.use(require('./routes/htmlRoutes')(db));

const routes = require("./controllers/mongoscrapeController.js");

app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
