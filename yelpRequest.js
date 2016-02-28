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
    if(id){
        updateDB(id)
        .then(() => {
            searchYelp(params, function(data, center){
                res.render('index', {"center":center,"geojson":data});
                writeJSON(data, "results.json");
            });
        });
    } else {
        //Search request
        searchYelp(params, function(data, center){
            res.render('index', {"center":center,"geojson":data});
            writeJSON(data, "results.json");
        });  
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
                    var c = "";
                    if(tableStatus){
                        c = "#32CD32";
                    } else {
                        c = "#fc4353";
                    }
                    
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
                            "marker-color": c,
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
    return new Promise(function(resolve, reject){
        var Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (err, business) =>{
            if(err) {reject(err); }
            if(business){
                var newHost = !business.host;
                Restaurant.update({restaurantId: id},{set:{host:newHost}}, function(e,business){
                    if(e){ reject(e); }
                    resolve();
                });
            }else{
                var restaurantItem = Restaurant({ restaurantId:id, host:true });
                restaurantItem.save(function(err,editedDoc){
                    if(err) return console.error(err);
                    console.log("added ", restaurantItem, "to the db");
                    resolve();
                });
            }
        });
    });
};

// I put stuff in ffasd
var readDB = function(id){
    return new Promise(function(resolve, reject){
        var Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (err, business) => {
           if (err) { reject(err); }
            if (business){
                resolve(business.host);
            }else
            {
                resolve(false);
            }
        });
    });
};
