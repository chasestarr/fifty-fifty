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
    searchYelp({ term: 'coffee', location: '33617'}, function(data){
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
        var out = res.businesses.map(function(element){
            var coordObj = element.location.coordinate;
            var rating = Math.floor(element.rating);
            var stars = "";
            for(var i = 0; i < rating; i++){
                stars = stars + "&#9733;";
            }
            var descript = "Address: " + element.location.address[0] + "<br>Rating: " + stars;
            
            //geoData object sent to html file
            obj = {
                type: "Feature",
                geometry:{
                    type: "Point",
                    coordinates: [coordObj.longitude,coordObj.latitude]
                },
                properties:{
                    title: element.name,
                    description: descript,
                    "marker-color": "#fc4353",
                    "marker-size": "small"      
                },
                id:element.id
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
   console.log("sever running at port:", this.address().port); 
});

//write json out to file for analyzing output
var writeJSON = function(json){
    fs.writeFile("results.json", JSON.stringify(json, null, 2), function(e){
        if(e) return console.log(e);
        console.log("JSON file was saved");
    });
};
