'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var _ = require('lodash');

var config = {
    compile: './src/assets/less/project.less',
    name: 'project',
    srcs: './src/assets/less/**/*',
    bundle: [],
    dest: {
        css: './build/assets/css',
        less: './build/assets/less'
    }
};

function less(options) {
    var settings = _.extend(config, options);

    var tasks = [{
        name: 'less',
        desc: 'Compile and copy styles to build folder',
        callback: runner
    },{
        name: 'less:compile',
        callback: compile
    },{
        name: 'less:bundle',
        callback: bundle
    },{
        name: 'less:copy',
        callback: copy
    }];

    ////////////////

    function runner(done) {
        runSequence(
            'less:compile',
            'less:bundle',
            'less:copy',
            done
        );
    }

    // Compile less styles
    function compile(done) {
        return gulp.src(settings.compile)
            .pipe($.less())
            .pipe($.rename(settings.name+'.css'))
            .pipe(gulp.dest(settings.dest.css))
            .pipe($.minifyCss({
                keepSpecialComments: 0,
                keepBreaks: false,
                processImport: true
            }))
            .pipe($.rename(settings.name+'.min.css'))
            .pipe(gulp.dest(settings.dest.css))
            .pipe($.size({title: 'styles:compile'}));
    }

    // Bundle sources and 3th libs
    function bundle(done) {

        if (!bundle.length) {
            return gulp.src('./')
               .pipe($.size({title: 'styles:bundle'}));
        }

        settings.bundle.push(settings.dest.css+'/'+settings.name+'.css');

        return gulp.src(settings.bundle)
            .pipe($.concat(settings.name+'.bundle.css'))
            .pipe($.minifyCss({
                keepSpecialComments: 0,
                keepBreaks: false,
                processImport: true
            }))
            .pipe($.rename(settings.name+'.bundle.css'))
            .pipe(gulp.dest(settings.dest.css))
            .pipe($.size({title: 'styles:bundle'}));
    }

    // Copy less sources
    function copy(done) {
        return gulp.src(settings.srcs)
            .pipe(gulp.dest(settings.dest.less))
            .pipe($.size({title: 'styles:copy'}));
    }

  ////////////////

  return tasks;
}

module.exports = less;
