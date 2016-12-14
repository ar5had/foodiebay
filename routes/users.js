module.exports = function(isLoggedIn, app) {
    app.get("/users", isLoggedIn, function(req, res) {
        res.send("this is users page");
    });
};
