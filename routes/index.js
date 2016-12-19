var checkIfUserLogged = function(req, res, next) {
  if (req.isAuthenticated() && !req.session.localresults) {
    console.log(req.user);
    var location;
    if (req.user.userLocation) {
      location = req.user.userLocation;
    
      var yelp = new Yelp({
        consumer_key: process.env.YELP_CONSUMER_KEY,
        consumer_secret: process.env.YELP_CONSUMER_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET
      });
      
      yelp.search({ term: 'food', location: location})
      .then(function (data) {
        req.session.localresults = data;
        return next();
      })
      .catch(function (err) {
        var error = new Error();
        error.status = err.statusCode;
        error.message = JSON.stringify(err.data);
        next(error);
      });
    } 
  } 
    
  next();   

};

module.exports = function(app) {
    app.get("/", function(req, res, next) {
        console.log("req.ses.localres",(req.session.localresults));
        res.render('./pages/index', {
            title: "Nytlyf Planner",
            user: req.user
        });
    });
};
