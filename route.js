'use strict'

const saveJSON = require('./utils/saveJson.js');
const dbUtils = require('./config/db.js');
const yelpReq = require('./searchYelp.js');

module.exports = function(app){
    let locPrev = "";
    app.get('/', (req,res) => {
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
        if(id){
            dbUtils.write(id)
            .then(() => {
                yelpReq.search(params, (data, center) => {
                    res.render('index', {"center":center,"geojson":data});
                    saveJSON(data, "./utils/results.json");
                });
            });
        } else {
            yelpReq.search(params, (data, center) => {
                res.render('index', {"center":center,"geojson":data});
                saveJSON(data, "./utils/results.json");
            });  
        } 
    });
}