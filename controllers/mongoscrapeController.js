const express = require("express");

const router = express.Router();

// const Mongoscrape = require('../models/mongoscrape');
const db = require("../models");

// const scrapedData=Mongoscrape.collection;

const axios = require("axios");
const cheerio = require("cheerio");

// Scrape data from one site and place it into the mongodb db
router.post("/", (req, res) => {

    if(req.body.scrape==='Yes'){
      // Make a request via axios for the news section of `ycombinator`
      axios.get("https://www.nytimes.com/section/us").then(response => {  
        // Load the html body from axios into cheerio
        const $ = cheerio.load(response.data);
        // For each element in latest news
        $(".css-13mho3u").children("ol").children("li").each((j, element2) => {
          // Save the text and href of each link enclosed in the current element
          const url = $(element2).children("div").children("div").children("a").attr("href");
          const headline = $(element2).children("div").children("div").children("a").children("h2").text();
          const summary = $(element2).children("div").children("div").children("a").children("p").text();
          
          // If this found element had both a title and a link
          if (url && headline && summary) {
            // Insert the data in the scrapedData db
            db.News.create({
              headline,
              url,
              summary,
              saved: false
            },
            (err, inserted) => {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
              }
              else {
                // Otherwise, log the inserted data
                //console.log(inserted);            
              }
            });
          }
        });
      });
    }

    if(req.body.save==='Yes'){
      var id=req.body.articleid;
      db.News.findOneAndUpdate({ _id: id }, { saved: true })
      .then(update => {
        console.log("update "+id);
      });
    }

    if(req.body.addnote==='Yes'){
      db.Note.create({usernote:req.body.usernote, news: req.body.uid })
      .then(dbNote => {
        // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
        // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.News.findOneAndUpdate({ _id: req.body.uid }, { $push: { notes: dbNote._id } });
      })
      .then(dbNews => {
        // If the Library was updated successfully, send it back to the client
        res.json(dbNews);
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(err);
      });
      
    }
});

// Export routes for server.js to use.
module.exports = router;
