var yelpConfig = require('./configs/yelpConfig.js');
var Yelp = require('yelp');
var yelp = new Yelp(yelpConfig);
var fs = require('fs');

var geoObj = {};

yelp.search({ term: 'coffee', location: '33617'}, function(e,res){
    // console.log(res);
   if(e) return console.log(res);
   var center = res.region.center;
   var out = res.businesses.map(function(element){
       var coordObj = element.location.coordinate;
       var rating = Math.floor(element.rating);
       var stars = "";
       for(var i = 0; i < rating; i++){
           stars = stars + "&#9733;";
       }
       var descript = "Address: " + element.location.address[0] + "<br>Rating: " + stars;
       var obj = {
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
       return obj;
   });
   geoObj = {
       center: center,
       geoJson: out
   };
   fs.writeFile("results.json", JSON.stringify(geoObj, null, 2), function(e){
       if(e) return console.log(e);
       console.log("the file was saved");
   })
});