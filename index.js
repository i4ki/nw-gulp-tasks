'use strict';

var gulp = require('gulp-help')(require('gulp'));
var _ = require('lodash');

module.exports = function(settings) {
    var build = [];

    _.forEach(settings, function(options, name) {
        var tasks =  require('./tasks/' + name)(options);

        build.push(name);

        tasks.forEach(function(task){
            task.desc = task.desc || false;
            gulp.task(task.name, task.desc, task.callback);
        });
    });

    gulp.task('build', 'Run lint for js, tests, and optimize code for production', build);

    return gulp;
};
