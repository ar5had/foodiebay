var querystring = require("querystring");

var checkIfUserLogged = function(req, res, next) {
  if (req.isAuthenticated() && req.user.userLocation) {
    req.session.savedLocation = req.user.userLocation;
    res.redirect("/results");   
  } else {
    next();   
  }
};

module.exports = function(app) {
    app.get("/", checkIfUserLogged, function(req, res, next) {
        res.render('./pages/index', {
            title: "Home - foodiebay",
            user: req.user
        });
    });
};
