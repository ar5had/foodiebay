var restaurants = require("../models/restaurants.js");

module.exports = function(app) {
    app.route('/markRestaurant')
    		.post(function (req, res) {
    		    var id = req.query.id;
    		    restaurants.findOne({'venueId': id})
    		        .exec(function(err, response) {
    		           if(err) {
    		               console.error("Error happened while finding people count for restaurant", err);
    		           } else {
    		               console.log("response is ", response);
    		               if (response === null) {
    		                   var restaurant = new restaurants();
    		                   restaurant.venueId = id;
    		                   restaurant.usersGoing = [id];
    		                   restaurant.save(function(err) {
                                    if (err)
                                        console.error("Some error happened while saving new restaurant:", err);
                                    else {
                                        console.log("new Restaurant marked successfully");
                                         if (req.isAuthenticated()) {
                                            res.status(200).send("You are going");
                                        } else {
            		                        res.status(200).send("1 user is going");
                                        }
                                    }
                                });
    		               } else {
    		                   console.log("Restaurant already existed!!");
    		                   var result = response.usersGoing;
        		               var index = result.indexOf(id);
        		               if (index === -1) {
        		                   result.push(id);
        		               } else {
        		                   result = result.slice(0, index).concat(result.slice(index + 1)); 
        		               }
        		               
        		               if (result.length > 0) {
        		                    restaurants.findOneAndUpdate({'venueId': id}, {$set: {"usersGoing": result}})
        		                        .exec(function(err, res) {
        		                           if (err) {
        		                               console.error("Some error happened while updating restaurant data:", err);
        		                           } else {
        		                               console.log("Restaurant data successfully updated! For id:", id, "usersGoing", result);
        		                               if (req.isAuthenticated()) {
        		                                   res.status(200).send(result.length !== 1 ? ("You and "+ result.length-1 + "others are going"): "You are going" );
        		                               } else {
        		                                   res.status(200).send(result.length + (result.length === 1 ? "user is going": "users are going"));
        		                               }
        		                           }
        		                        });
        		                   
        		               } else {
        		                   restaurants.findOneAndRemove({ 'venueId': id})
        		                        .exec(function(err) {
        		                            if (err) {
        		                                console.error("error happened while removing empty restaurant object", err);   
        		                            } else {
        		                                console.log("Successfully removed empty restaurant object");
        		                                res.status(200).send("No one is going");
        		                            }        
        		                        });
        		               }
    		               }
    		           }
    		        });
    		});
};