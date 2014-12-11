'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var _ = require('lodash');

var config = {
    name: 'project',
    srcs: './src/modules/**/*.js',
    bundle: [],
    dest: {
        tmp: './tmp',
        js: './build/js'
    }
};

function scripts(options) {
    var settings = _.extend(config, options);

    var tasks = [{
        name: 'styles',
        desc: 'Optimize and minify scripts to build folder',
        callback: runner
    },{
        name: 'scripts:jshint',
        callback: jshint
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
        callback: clean
    }];

    ////////////////

    function runner(done) {
        runSequence(
            'jshint',
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
            .pipe($.size({title: 'jshint'}));
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
            .pipe(gulp.dest(settings.dest.tmp));
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
            .pipe($.size({title: 'scripts:core'}));
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
            .pipe(gulp.dest(settings.dest.js))
            .pipe($.size({title: 'scripts:bundle'}));
    }

    function clean(done) {
        return del.bind(null, [dists.tmp]));
    }


  ////////////////

  return tasks;
}

module.exports = scripts;
