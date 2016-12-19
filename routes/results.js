var users = require("../models/users.js");
var request = require("request");
var querystring = require("querystring");
var satelize = require("satelize");

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
  
  var credentials = {
    'v': '20140806',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  };
  
  var urlString = "https://api.foursquare.com/v2/venues/search?";
  
  var params;
  
  if(req.query.loc === "true") {
    var ll, ip = req.header('x-forwarded-for') || req.connection.remoteAddress; 
    console.log("ip is", ip);
    var url = 'http://freegeoip.net/json/' + ip;
    
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var res = JSON.parse(body);
          ll = res.latitude + "," + res.longitude;
          params = {
            'll' : ll.toString(),
            'query': "restaurant"
          };
          urlString += querystring.stringify(params) + '&' + querystring.stringify(credentials);
      
          request(urlString, function (error, response, results) {
            if (!error && response.statusCode == 200) {
              req.ids = JSON.parse(results).response.venues.map(function(result) { return "/venues/" + result.id });
              req.results = [];
              next();
            } else {
              next(error);
            }
          });
          
      } else {
        next(error);
      }
    });
    
  } else { 		  
    var location = req.body.searchBar;
    params = {
        'near': location,
        'query': "restaurant"
    };
    
    urlString += querystring.stringify(params) + '&' + querystring.stringify(credentials);
    
    request(urlString, function (error, response, results) {
      if (!error && response.statusCode == 200) {
        req.ids = JSON.parse(results).response.venues.map(function(result) { return "/venues/" + result.id });
        req.results = [];
        next();
      } else {
        next(error);
      }
    });
  }
  
};

var filterData = function(req, res, next) {
    
    var credentials = {
      'v': '20140806',
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET
    };
    var urlString = "https://api.foursquare.com/v2/multi?requests=" + req.ids.slice(0, 10).join(',') + '&' + querystring.stringify(credentials);
    request(urlString, function (error, response, results) {
      
        if (!error && response.statusCode == 200) {
          JSON.parse(results).response.responses.forEach(function(result){
              var venue = result.response.venue;
              var obj = {};
              obj.name = venue.name;
              obj.rating = venue.rating && venue.rating;
              obj.ratingColor = venue.rating && venue.ratingColor;
              obj.category = venue.categories[0] && venue.categories[0].shortName;
              obj.phoneNo = venue.contact.phoneNo;
              obj.address = venue.location.formattedAddress.join();
              obj.status = venue.hereNow && venue.hereNow.summary;
              obj.tier = venue.price && venue.price.tier;
              obj.currency = venue.price && venue.price.currency;
              obj.imgUrl = venue.photos.groups[0] && (venue.photos.groups[0].items[0].prefix + '300x300' + venue.photos.groups[0].items[0].suffix);
              obj.imgUrl = obj.imgUrl ? obj.imgUrl: (venue.bestPhoto && venue.bestPhoto.prefix + '300x300' + venue.bestPhoto.suffix);
              obj.comment =  venue.tips.groups[0].items[0] && venue.tips.groups[0].items[0].text;
              obj.commentator = { 'name': venue.photos.groups[0] && venue.photos.groups[0].items[0].user.firstName, 
                'imgUrl': obj.commentator = venue.photos.groups[0] && (venue.photos.groups[0].items[0].user.photo.prefix + '70x70' + venue.photos.groups[0].items[0].user.photo.suffix),
                'date' : venue.photos.groups[0] && (new Date(venue.photos.groups[0].items[0].createdAt.toString()).toDateString())
              };
              obj.likesCount = venue.likes && venue.likes.count;
              obj.url = venue.shortUrl;
              req.results.push(obj);
          });
          
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
   delete req.results;
   delete req.ids;
};

module.exports = function(app) {
    app.route('/results')
    		.post(isUserLogged, getResults, filterData, showResults);
};