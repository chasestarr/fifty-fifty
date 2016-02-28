'use strict';

var mongoose = require('mongoose');

module.exports = {
  restaurant: require('./restaurant')(mongoose)
};