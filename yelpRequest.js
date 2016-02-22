var yelpConfig = require('./configs/yelpConfig.js');
var MongoClient = require('mongodb').MongoClient;
var Yelp = require('yelp');
var fs = require('fs');
var express = require('express');
var cons = require('consolidate');
var swig = require('swig');

var yelp = new Yelp(yelpConfig);
var app = express();
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');

app.get('/', function(req,res,next){
    var loc = req.query.loc;
    var id = req.query.id;
    var params = {};
    if(loc === undefined || loc === null){
        params = {term: 'coffee', location: 'san+francisco'};
    } else {
        params = {term: 'coffee', location: loc};
    }
    //Search request
    searchYelp(params, function(data){
        var centerArr = data.center;
        var mapData = data.geoJSON;
        res.render('index', {"center":centerArr,"geojson":mapData});
        writeJSON(data, "results.json");       
    });
    
    //Database update
    if(id != undefined || id != null){
        //Call function to add data to the database
        // updateDB(id);
    }
});

var searchYelp = function(params, callback){
    yelp.search(params, function(e,res){
        // console.log(res);
        if(e) return console.log(e);
        var center = [res.region.center.latitude, res.region.center.longitude];
        //Map api response to simplified format
        var out = res.businesses.map(function(element){
            readDB(element.id);
            var coordObj = element.location.coordinate;
            //geoData object sent to html file
            var obj = {
                type: "Feature",
                geometry:{
                    type: "Point",
                    coordinates: [coordObj.longitude,coordObj.latitude]
                },
                properties:{
                    title: element.name,
                    url: element.url,
                    address: element.location.address[0],
                    rating: starRating(element.rating),
                    id: element.id,
                    "marker-color": "#fc4353",
                    "marker-size": "small"      
                },
                db:{
                    id:element.id,
                    host:false
                }
            };
            // send geoData object back to out var
            return obj;
        });
        //package data to not repeat center obj
        var geoObj = {
            center: center,
            geoJSON: out
        }
        callback(geoObj);
    });   
};

app.listen(3000, function(){
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
        
        var cursor = db.colelction("tables").find({});
    });
};

var readDB = function(id){
    console.log(id);
    var tableStatus = false;
    MongoClient.connect('mongodb://localhost:27017/fifty-fifty', function(e,db){
        var cursor = db.collection("tables").find({_id: id});
        cursor.each(function(e,doc){
            if(e) throw e;
            if(doc == null) return false;
            tableStatus = doc.host;
            console.log(tableStatus);
        });
    });
};
