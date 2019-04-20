const router = require('express').Router();
module.exports = (db) => {
    router.get('/', function(req, res) {
        //db.News.find({ saved:false })
        db.News.find({saved:false, displayed:false}).sort({'date': -1}).limit(10)
        // Specify that we want to populate the retrieved saved news with any associated notes
        .populate("notes")
        .then(dbNews => {
          
          for (var i=0;i<dbNews.length;i++){
            console.log(dbNews[i]._id);
            db.News.findOneAndUpdate({ _id: dbNews[i]._id }, { displayed: true })
            .then(update => {
              console.log("update "+dbNews[i]._id);
            });
          }
          // If any saved news are found, send them to the client with any associated notes
          res.render("index",{dbNews:dbNews});
        })
        .catch(err => {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });
    router.get('/savednews', function(req, res) {
      db.News.find({ saved:true })
      // Specify that we want to populate the retrieved saved news with any associated notes
      .populate("notes")
      .then(dbSavedNews => {
        // If any saved news are found, send them to the client with any associated notes
        res.render("savednews",{dbSavedNews:dbSavedNews});
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(err);
      });
    });
    router.get('/api/news', function(req, res) {
        db.News.find({saved: false})
        .then(dbNews => { 
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNews);
        })
        .catch(err => {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    router.get('/api/savednews', function(req, res) {
        db.News.find({ saved: true })
        // Specify that we want to populate the retrieved saved news with any associated notes
        .populate("notes")
        .then(dbSavedNews => {
          // If any saved news are found, send them to the client with any associated notes
          res.json(dbSavedNews);
        })
        .catch(err => {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });
    return router;
};