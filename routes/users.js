module.exports = function(app) {
    app.get("/users", function(req, res) {
        res.send("this is users page");
    });
};
