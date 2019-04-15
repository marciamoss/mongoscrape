// Dependencies
const express = require("express");

// Initialize Express
const app = express();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up mongoose connection
const mongoose = require('mongoose');
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

// Database configuration with mongoose
var databaseUri = 'mongodb://localhost/newsscraper';
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}else {
  mongoose.connect(databaseUri);
}
// end of db config

var db = mongoose.connection;

db.on("error", error => {
  console.log("Mongoose Error:", error);
});
db.once("open", error => {
  console.log("Mongoose connection successful.");
});

app.use(require('./routes/htmlRoutes')(mongoose));
// Import routes and give the server access to them.
const routes = require("./controllers/mongoscrapeController.js");

app.use(routes);

// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});
