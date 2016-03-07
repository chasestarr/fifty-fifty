'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const dbConfig = require('./config/configFiles/dbConfig.js');


let jsFiles = ['*.js'];
gulp.task('serve', () => {
    let options = {
        script: 'app.js',
        delayTime: 1,
        env:{'PORT': 3000, 'DBCONN':'mongodb://chase:gqh3ghk1@ds023478.mlab.com:23478/heroku_gqh3ghk1'},
        watch: jsFiles
    };
    return nodemon(options)
    .on('restart', (env) => {
       console.log(env + ' : restarting....');
    });
});