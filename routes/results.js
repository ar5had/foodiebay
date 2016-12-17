var users = require("../models/users.js");
var request = require("request");
var querystring = require("querystring");

var isUserLogged = function(req, res, next) {
  if (req.isAuthenticated()) {
    users.findOneAndUpdate({_id: req.user._id}, {$set: {userLocation: req.body.searchBar}})
      .exec(function(err) {
        if (err) 
          return next(err);
        else
          next();
        
      });
  } else {
    next();
  }
};

var getResults = function (req, res, next) {
    		  
  var location = req.body.searchBar;
  var date = '20140806';
  var params = {
      "near": location,
      "query": "restaurant"
  };
  var credentials = {
    'v': date,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  };
  var urlString = "https://api.foursquare.com/v2/venues/search?" + querystring.stringify(params) + '&' + querystring.stringify(credentials);
  
  request(urlString, function (error, response, results) {
    if (!error && response.statusCode == 200) {
      req.results = JSON.parse(results).response.venues;
      next();
    } else {
      next(error);
    }
  });
};

var showResults = function(req, res) {
  res.render('./pages/resultsPage', {
            title: "Nytlyf Planner",
            user: req.user,
            results: req.results
        });
  
      console.log('show results',req.results);
  delete req.results;
};

module.exports = function(app) {
    app.route('/results')
    		.post(isUserLogged, getResults, showResults);
};