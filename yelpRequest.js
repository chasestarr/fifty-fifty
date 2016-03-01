'use strict'
const yelpConfig = require('./configs/yelpConfig.js');
const Yelp = require('yelp');
const fs = require('fs');
const express = require('express');
const cons = require('consolidate');
const swig = require('swig');
let nodePort = process.env.PORT || 3000;
let dbConn = process.env.DBCONN || 'mongodb://localhost/fifty-fifty';
const yelp = new Yelp(yelpConfig);
let app = express();

const mongoose = require('mongoose');
mongoose.connect(dbConn);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    // connected
    console.log('mongoose connected successfully');
    require('./config/mongoose/seed')(db);
});

let schema = require('./config/schema/databaseSchema');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');

let locPrev = "";
app.get('/', (req,res) => {
    let loc = req.query.loc;
    let id = req.query.id;
    let params = {};
    // let params = loc ? {term: 'coffee', location: loc} : {term: 'coffee', location: 'san+francisco'};
    if(loc && locPrev == ""){
        locPrev = loc;
        params = {term: 'coffee', location: loc};
    } else if(loc == null && locPrev == ""){
        params = {term: 'coffee', location: 'san+francisco'};
    } else if(loc && locPrev != ""){
        locPrev = loc;
        params  = {term: 'coffee', location: loc};
    } else {
        params  = {term: 'coffee', location: locPrev};
    }
    if(id){
        updateDB(id)
        .then(() => {
            searchYelp(params, (data, center) => {
                res.render('index', {"center":center,"geojson":data});
                writeJSON(data, "results.json");
            });
        });
    } else {
        //Search request
        searchYelp(params, (data, center) => {
            res.render('index', {"center":center,"geojson":data});
            writeJSON(data, "results.json");
        });  
    } 
});

  searchYelp (params, callback) {
    let newMap = [];
    let outputCount = 1;

    yelp.search(params, (e,res) => {
        if(e) return console.error(e);
        let center = [res.region.center.latitude, res.region.center.longitude];

        //Map api response to format readable by mapbox
        res.businesses.map((element) => {
            readDB(element.id)
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

//start server at http://localhost:3000/
app.listen(nodePort, function(){
    console.log("server running at port:", this.address().port);
});

//write json out to file for analyzing output
function writeJSON(json, fileName){
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function(e){
        if(e) return console.error(e);
        console.log("'" + fileName + "' was saved");
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
    let text = b ? "Stop hosting" : "Host table";
    return text;
};

//update json file with id information
function updateDB(id){
    return new Promise((resolve, reject) => {
        let Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (e, business) =>{
            if(e) {reject(e); }
            if(business){
                business.update({restaurantId: business.id},{host:!business.host}, (e,bus) => {
                    if(e){ reject(e); }
                    resolve();
                });
            }else{
                let restaurantItem = Restaurant({ restaurantId:id, host:true });
                restaurantItem.save((e,editedDoc) => {
                    if(e) return console.error(e);
                    resolve();
                });
            }
        });
    });
};

// read info from database
function readDB(id){
    return new Promise((resolve, reject) => {
        let Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (err, business) => {
           if (err) { reject(err); }
           business ? resolve(business.host) : resolve(false);
        });
    });
};
