'use strict';

var gulp = require('gulp-help')(require('gulp'));
var _ = require('lodash');

module.exports = function(settings) {
    var bundle = [];

    _.forEach(settings, function(options, name) {

        var tasks;
        var build = name.indexOf('_');

        if (!build) {
            name = name.substr(1);
        } else {
            bundle.push(name);
        }

        tasks =  require('./tasks/' + name)(options);

        tasks.forEach(function(task){
            var taskName = task.name.replace(name+':', '');

            if ( options._tasks === undefined || options._tasks.indexOf(taskName) > -1 ) {
                task.desc = task.desc || false;
                gulp.task(task.name, task.desc, task.callback);
            }
        });
    });

    if (bundle.length) {
        gulp.task('build', 'Run tasks: ' + bundle.join(', '), bundle);
    }

    return gulp;
};
