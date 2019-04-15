const router = require('express').Router();
const Mongoscrape = require('../models/mongoscrape');

module.exports = (mongoose) => {
    const scrapedData=Mongoscrape.db.collections.news;

    router.get('/', function(req, res) {
        res.render("index");
    });
    
    
    router.get('/api/news', function(req, res) {
        scrapedData.find({},function(err, news) {
            let scrape=[];
            news.forEach(function(element){
                scrape.push(element);
            },function(){ res.send(scrape);}); 
        });
    });

    return router;
};