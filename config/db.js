'use strict'

const mongoose = require('mongoose');
const schema = require('./schema/databaseSchema');

module.exports = {
    read: readDb,
    write: writeDb
};

function readDb(id){
    return new Promise((resolve, reject) => {
        let Restaurant = schema.restaurant;
        Restaurant.findOne({restaurantId: id}, (err, business) => {
           if (err) { reject(err); }
           business ? resolve(business.host) : resolve(false);
        });
    });
}

function writeDb(id){
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
}