'use strict'
const yelpConfig = require('./config/yelpConfig.js');
const Yelp = require('yelp');
const yelp = new Yelp(yelpConfig);
const dbUtils = require('./config/db.js');

module.exports = {
    search: searchYelp
}

function searchYelp(params, callback){
    //As it loops through the api response, populate this array below
    let newMap = [];
    let outputCount = 1;
    
    //Send a request to yelp api
    yelp.search(params, (e,res) => {
        if(e) return console.error(e);
        let center = [res.region.center.latitude, res.region.center.longitude];

        //Loop through api response, create a new data package that is readable by mapbox
        res.businesses.forEach((element) => {
            //check the database to see if any cafe currently has a host
            dbUtils.read(element.id)
                .then((tableStatus) => {
                    return {
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
                            toggle: toggleButton(tableStatus),
                            "marker-color": markerColor(tableStatus),
                            "marker-size": "small"
                        }
                    };
                })
                .then((output) => {
                    if (res.businesses.length > outputCount) {
                        outputCount += 1;
                        newMap.push(output);
                    } else {
                        //call callback function with map data and center data. reset values
                        callback(newMap, center);
                        newMap = [];
                        outputCount = 1;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    });
};

//convert number rating to unicode stars
function starRating(num){
    let stars = "";
    let flatRating = Math.floor(num);
    for(let i = 0; i < flatRating; i++){
        stars = stars + "&#9734;";
    }
    return stars;
};

//return marker color based on boolean
function markerColor(b){
    let color  = b ? "#FC7143" : "#fc4353";
    return color;
};

//return text for a button based on boolean
function toggleButton(b){
    let text = b ? "Stop sharing" : "Split a table";
    return text;
};