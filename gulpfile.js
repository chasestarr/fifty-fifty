'use strict';

const gulp = require('gulp');

const nodemon = require('gulp-nodemon');


let jsFiles = ['*.js'];
gulp.task('serve', () => {
    let options = {
        script: 'app.js',
        delayTime: 1,
        env:{'PORT': 3000, 'DBCONN':'mongodb://localhost/fifty-fifty'},
        watch: jsFiles
    };
    return nodemon(options)
    .on('restart', (env) => {
       console.log(env + ' : restarting....');
    });
});