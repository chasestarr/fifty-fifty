var yelpConfig = require('./configs/yelpConfig.js');
var Yelp = require('yelp');

var yelp = new Yelp(yelpConfig);

yelp.search({ term: 'coffee', location: 'Tampa'}, function(e,res){
   if(e) return console.log(res);
   var center = res.region.center;
   var out = res.businesses.map(function(element){
       return element.name;
   });
   console.log(out); 
});
