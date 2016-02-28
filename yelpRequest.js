var yelpConfig = require('./configs/yelpConfig.js');
var Yelp = require('yelp');
var fs = require('fs');
var express = require('express');
var cons = require('consolidate');
var swig = require('swig');
var nodePort = process.env.PORT || 3000;
var dbConn = process.env.DBCONN || 'mongodb://localhost/fifty-fifty';
var yelp = new Yelp(yelpConfig);
var app = express();
var mongoose = require('mongoose');
mongoose.connect(dbConn);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    // connected
    console.log('mongoose connected successfully');

    require('./config/mongoose/seed')(db);

});

var schema = require('./config/schema/databaseSchema');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');

app.get('/', function(req,res){
    var loc = req.query.loc;
    var id = req.query.id;
    var params = {};
    if(loc === undefined || loc === null){
        params = {term: 'coffee', location: 'san+francisco'};
    } else {
        params = {term: 'coffee', location: loc};
    }
    //Search request
    searchYelp(params, function(data, center){
       // var centerArr = data.center;
       // var mapData = data.geoJSON;
        res.render('index', {"center":center,"geojson":data});
        writeJSON(data, "results.json");
    });

    //Database update
    if(id != undefined || id != null){
        //Call function to add data to the database
        // updateDB(id);
    }
});





var searchYelp = function(params, callback){
    var newMap = [];
    newMap.push = function() {Array.prototype.push.apply(this, arguments);  };
    newMap.splice = function() {Array.prototype.splice.apply(this, arguments);  };
    var outputCount = 1;

    yelp.search(params, function(e,res){
        // console.log(res);
        if(e) return console.log(e);
        var center = [res.region.center.latitude, res.region.center.longitude];

        //Map api response to format readable by mapbox
        var businessData = res.businesses.map(function(element){
            readDB(element.id)
                .then((tableStatus) => {
                    return output = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [element.location.coordinate.longitude, element.location.coordinate.latitude]
                        },
                        properties: {
                            title: element.name,
                            url: element.url,
                            address: element.location.address[0],
                            rating: starRating(element.rating),
                            host: tableStatus,
                            id: element.id,
                            "marker-color": "#fc4353",
                            "marker-size": "small"
                        }
                    };
                })
                .then((output) => {
                    if (res.businesses.length > outputCount) {
                        outputCount += 1;
                        var geoObj = {
                            center: center,
                            geoJSON: output
                        };

                        newMap.push(output);
                    }
                    else {
                        callback(newMap, center);
                        newMap = [];
                        outputCount = 1;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        })


    });
};

//start server at http://localhost:3000/
app.listen(nodePort, function(){
    console.log("server running at port:", this.address().port);
});

//write json out to file for analyzing output
var writeJSON = function(json, fileName){
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function(e){
        if(e) return console.log(e);
        console.log("'" + fileName + "' was saved");
    });
};

//convert number rating to unicode stars
var starRating = function(num){
    var stars = "";
    var flatRating = Math.floor(num);
    for(var i = 0; i < flatRating; i++){
        stars = stars + "&#9734;";
    }
    return stars;
}

//update json file with id information
var updateDB = function(id){
    MongoClient.connect('mongodb://localhost:27017/fifty-fifty', function(e,db){
        if(e) throw e;
        var cursor = db.collection("tables").find({});
    });
};

// I put stuff in ffasd
var readDB = function(id){
    return new Promise(function(resolve, reject){
        var Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (err, person) => {
           if (err) { reject(err); }
            if (person){
                resolve(person.host);
            }else
            {
                resolve(false);
            }
        });
    });
};
