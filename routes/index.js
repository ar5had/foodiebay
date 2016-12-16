module.exports = function(app) {
    app.get("/", function(req, res, next) {
        console.log((req.session.localresults));
        res.render('./pages/index', {
            title: "Nytlyf Planner",
            user: req.user,
            results: req.session.localresults 
        });
        delete req.session.localresults;
        req.session.save();
    });
};
