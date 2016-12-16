var Yelp = require("yelp");
var users = require("../models/users.js");

var isUserLogged = function(req, res, next) {
  if (req.isAuthenticated()) {
    users.findOneAndUpdate({_id: req.user._id}, {$set: {userLocation: req.body.searchBar}})
      .exec(function(err) {
        if (err) 
          return next(err);
        else
          next();
        
      });
  }
};

module.exports = function(app) {
    app.route('/search')
    		.post(isUserLogged,function (req, res, next) {
    		    
    		    var location = req.body.searchBar;
    		    
    		    var yelp = new Yelp({
                  consumer_key: process.env.YELP_CONSUMER_KEY,
                  consumer_secret: process.env.YELP_CONSUMER_SECRET,
                  token: process.env.YELP_TOKEN,
                  token_secret: process.env.YELP_TOKEN_SECRET
                });
                
                yelp.search({ term: 'food', location: location})
                .then(function (data) {
                  req.session.localresults = data;
                  res.redirect('/');
                })
                .catch(function (err) {
                  var error = new Error();
                  error.status = err.statusCode;
                  error.message = JSON.stringify(err.data);
                  next(error);
                });
    		    
    		});
};