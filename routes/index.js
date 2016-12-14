module.exports = function(app) {
    app.get("/", function(req, res, next) {
        console.log(req.user);
        res.render('./pages/index', {
            title: "Nytlyf Planner",
            user: req.user
        });
    });
};
