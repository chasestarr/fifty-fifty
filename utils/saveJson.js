'use strict'

const fs = require('fs');

module.exports = function(json, fileName){
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function(e){
       if(e) return console.error(e);
       console.log("'" + fileName + "' was saved"); 
    });
};