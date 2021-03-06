'use strict'

let nodePort = process.env.PORT || 3000;
let dbConn = process.env.DBCONN || 'mongodb://chase:gqh3ghk1@ds023478.mlab.com:23478/heroku_gqh3ghk1'; //comment to setup local db ***
// let dbConn = "mongodb://localhost/fifty-fifty"; //uncomment for local db ***
const express = require('express');
const cons = require('consolidate');
const swig = require('swig');
let app = express();

const mongoose = require('mongoose');
const schema = require('./config/schema/databaseSchema');

mongoose.connect(dbConn);
const db = mongoose.connection;

//*** Uncomment to seed the database ***
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', () => {
//     // connected
//     console.log('mongoose connected successfully');
//     require('./config/mongoose/seed')(db);
// });


//setting up the swig templating. This will allow me to push the geoJSON data out to the html page.
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');

//broke out the url functionality into a separate module
require('./route.js')(app);

//start server at http://localhost:3000/
app.listen(nodePort, function(){
    console.log("server running at port:", this.address().port);
});
