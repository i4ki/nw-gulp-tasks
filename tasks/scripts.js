'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var plato = require('plato');
var del = require('del');
var _ = require('lodash');
var fs = require('fs');

var config = {
    name: 'project',
    srcs: './src/modules/**/*.js',
    bundle: [],
    reports: 'reports/quality',
    dest: {
        tmp: './tmp',
        js: './build/js'
    }
};

function scripts(options) {
    var settings = _.extend(config, options);

    var tasks = [{
        name: 'scripts',
        desc: 'Optimize and minify scripts to build folder',
        callback: runner
    },{
        name: 'scripts:jshint',
        callback: jshint
    },{
        name: 'scripts:analysis',
        callback: analysis
    },{
        name: 'scripts:tmp',
        callback: tmp
    },{
        name: 'scripts:directives',
        callback: directives
    },{
        name: 'scripts:build',
        callback: build
    },{
        name: 'scripts:bundle',
        callback: bundle
    },{
        name: 'scripts:clean-tmp',
        callback: del.bind(null, [settings.dest.tmp])
    }];

    ////////////////

    function runner(done) {
        runSequence(
            'scripts:jshint',
            'scripts:analysis',
            'scripts:tmp',
            'scripts:directives',
            'scripts:build',
            'scripts:bundle',
            'scripts:clean-tmp',
          done
        );
    }

    // Lint JavaScript
    function jshint(done) {
        return gulp.src(settings.srcs)
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.size({title: 'scripts:jshint'}));
    }

    // Analysis Report
    function analysis(done) {
        var jshint = fs.readFileSync('./.jshintrc', 'utf8');

        var options = {
          jshint: JSON.parse(jshint)
        };

        var callback = function (report) {
            done();
        };

        plato.inspect(settings.srcs, settings.reports, options, callback);
    }

    // Copy to tmp
    function tmp(done) {
        return gulp.src(settings.srcs)
            .pipe(gulp.dest(settings.dest.tmp))
            .pipe($.size({title: 'scripts:tmp'}));
    }

    function directives(done) {
        return gulp.src('./tmp/**/directives/*.js')
            .pipe($.directiveReplace({root: 'src'}))
            .pipe(gulp.dest(settings.dest.tmp))
            .pipe($.size({title: 'scripts:directives'}));
    }

    // Optimize code
    function build(done) {
        return gulp.src([
                './tmp/**/module.js',
                './tmp/**/*.js'
            ])
            .pipe($.concat(settings.name+'.js'))
            .pipe(gulp.dest(settings.dest.js))
            .pipe($.uglify({preserveComments:'some'}))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest(settings.dest.js))
            .pipe($.size({title: 'scripts:build'}));
    }

    // Optimize code
    function bundle(done) {

        if (!bundle.length) {
            return gulp.src('./')
               .pipe($.size({title: 'scripts:bundle'}));
        }

        settings.bundle.push(settings.dest.js+'/'+settings.name+'.js');

        return gulp.src(settings.bundle)
            .pipe($.concat(settings.name+'.bundle.js'))
            .pipe($.uglify({preserveComments:'some'}))
            .pipe(gulp.dest(settings.dest.js))
            .pipe($.size({title: 'scripts:bundle'}));
    }

  ////////////////

  return tasks;
}

module.exports = scripts;
