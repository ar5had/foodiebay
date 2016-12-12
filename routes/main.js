'use strict';
var index = require("./index.js");
var users = require("./users.js");
//var auth = require("./auth.js")

module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            // if user tries to access protected page before login, 
            // then store that page in a session variable and redirect to 
            // it after user get logged in.
            req.session.returnTo = req.path;
            res.redirect('/login');
        }
    }

    index(app);
    users(app);
    //auth(app);
};
