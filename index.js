'use strict';

var gulp = require('gulp-help')(require('gulp'));
var _ = require('lodash');

module.exports = function(settings) {

    _.forEach(settings, function(options, name) {
        var tasks =  require('./tasks/' + name)(options);

        tasks.forEach(function(task){
            task.desc = task.desc || false;
            gulp.task(task.name, task.desc, task.callback);
        });
    });

    return gulp;
};
