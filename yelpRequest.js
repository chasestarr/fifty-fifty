var yelpConfig = require('./configs/yelpConfig.js');
var Yelp = require('yelp');
var yelp = new Yelp(yelpConfig);

var geoObj = {};

yelp.search({ term: 'coffee', location: '33617'}, function(e,res){
   if(e) return console.log(res);
   var center = res.region.center;
   var out = res.businesses.map(function(element){
       var coordObj = element.location.coordinate;
       var descript = "Address: " + element.location.address[0] + "<br>Rating: " + element.rating;
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
           }
       };
       return obj;
   });
   geoObj = {
       center: center,
       geoJson: out
   };
   console.log(JSON.stringify(geoObj, null, 2));
});

