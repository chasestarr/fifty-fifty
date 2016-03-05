'use strict'
const yelpConfig = require('./config/yelpConfig.js');
const Yelp = require('yelp');
const yelp = new Yelp(yelpConfig);
const dbUtils = require('./config/db.js');

module.exports = {
    search: searchYelp
}

function searchYelp(params, callback){
    let newMap = [];
    let outputCount = 1;

    yelp.search(params, (e,res) => {
        if(e) return console.error(e);
        let center = [res.region.center.latitude, res.region.center.longitude];

        //Map api response to format readable by mapbox
        res.businesses.map((element) => {
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

function markerColor(b){
    let color  = b ? "#FC7143" : "#fc4353";
    return color;
};

function toggleButton(b){
    let text = b ? "Stop sharing" : "Split a table";
    return text;
};