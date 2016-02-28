'use strict';

var schema = require('../schema/databaseSchema');

module.exports = function(db){
    // mongoose command to drop your db
    console.log("database dropped");
     db.db.dropDatabase();

    // seed restaurant
    for (var item of restaurantSeeds()) {
        var seedrestaurantitem = schema.restaurant(item);
        seedrestaurantitem.save(function (err, editedDoc) {
            if (err) return console.error(err);
        });
    }
};

function restaurantSeeds(){
    return[{ restaurantId: 'hello world', host: true },{ restaurantId : "fifty-fifty-coffee-and-tea-san-francisco", host : true },{ restaurantId : "coffeeshop-san-francisco", host : true }]
}