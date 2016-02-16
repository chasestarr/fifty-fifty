var yelpConfig = require('./configs/yelpConfig.js');
var Yelp = require('yelp');
var fs = require('fs');
var express = require('express');
var cons = require('consolidate');
var swig = require('swig');

var app = express();
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
var yelp = new Yelp(yelpConfig);

app.get('/', function(req,res,next){
    var loc = req.query.loc;
    var params = {};
    if(loc === undefined || loc === null){
        params = {term: 'coffee', location: 'san+francisco'};
    } else {
        params = {term: 'coffee', location: loc};
    }
    searchYelp(params, function(data){
        var centerArr = data.center;
        var mapData = data.geoJSON;
        res.render('index', {"center":centerArr,"geojson":mapData});
        writeJSON(data);       
    });
});

var searchYelp = function(params, callback){
    yelp.search(params, function(e,res){
        // console.log(res);
        if(e) return console.log(res);
        var center = [res.region.center.latitude, res.region.center.longitude];
        //Map api response to simplified format
        var out = res.businesses.map(function(element){
            var coordObj = element.location.coordinate;
            var descript = "Address: " + element.location.address[0] + 
                "<br>Rating: " + starRating(element.rating) + 
                '<br><button onclick="hostTable();" type="button" class="hostButton" id ="' + element.id + '">Host table</button>';
            
            //geoData object sent to html file
            obj = {
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
var writeJSON = function(json){
    fs.writeFile("results.json", JSON.stringify(json, null, 2), function(e){
        if(e) return console.log(e);
        console.log("JSON file was saved");
    });
};

var starRating = function(num){
    var stars = "";
    flatRating = Math.floor(num);
    for(var i = 0; i < flatRating; i++){
        stars = stars + "&#9733;";
    }
    return stars;
}
