'use strict'

const saveJSON = require('./utils/saveJson.js');
const dbUtils = require('./config/db.js');
const yelpReq = require('./searchYelp.js');

module.exports = function(app){
    let locPrev = "";
    //Checks for query parameters
    app.get('/', (req,res) => {
        //saves location after hosting a table. returns user to that location.
        let loc = req.query.loc;
        let id = req.query.id;
        let params = {};
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
        //If there is an id in the query, call the db.write function, search for yelp data, then send data to html
        if(id){
            dbUtils.write(id)
            .then(() => {
                yelpReq.search(params, (data, center) => {
                    res.render('index', {"center":center,"geojson":data});
                    saveJSON(data, "./utils/results.json");
                });
            });
        } else {
            //If there is no id, just search yelp then send data to html
            yelpReq.search(params, (data, center) => {
                res.render('index', {"center":center,"geojson":data});
                saveJSON(data, "./utils/results.json");
            });  
        } 
    });
}