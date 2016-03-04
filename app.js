'use strict'

let nodePort = process.env.PORT || 3000;
let dbConn = process.env.DBCONN || 'mongodb://localhost/fifty-fifty';

const express = require('express');
const cons = require('consolidate');
const swig = require('swig');
let app = express();

const mongoose = require('mongoose');
const schema = require('./config/schema/databaseSchema');
mongoose.connect(dbConn);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    // connected
    console.log('mongoose connected successfully');
    require('./config/mongoose/seed')(db);
});



app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
require('./route.js')(app);

//start server at http://localhost:3000/
app.listen(nodePort, function(){
    console.log("server running at port:", this.address().port);
});
