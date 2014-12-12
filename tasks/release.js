'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var _ = require('lodash');
var argv = require('yargs').argv;

var config = {
    name: 'project'
};

function  release(options) {
    var settings = _.extend(config, options);

    var tasks = [{
        name: 'release',
        desc: 'Create a new tag, rebase branches and push to repo',
        callback: runner
    },{
        name: 'release:bump',
        callback: bump
    },{
        name: 'release:rebase',
        callback: rebase
    },{
        name: 'release:tag',
        callback: tag
    }];

    ////////////////

    function runner(done) {
        runSequence(
            'release:bump',
            'release:rebase',
            'release:tag',
            done
        );
    }

    function bump(done) {
        return gulp.src([
                './bower.json',
                './package.json'
            ])
            .pipe($.bump({version: argv.v}))
            .pipe(gulp.dest('./'))
            .pipe($.git.add())
            .pipe($.git.commit('[CHANGE] - Bump bower.json and package.json'))
            .pipe($.size({title: 'release:bump'}));
    }

    function rebase(done) {
        return gulp.src('./')
            .pipe($.shell('git checkout master'))
            .pipe($.shell('git merge develop'))
            .pipe($.shell('git checkout develop'))
            .pipe($.shell('git push origin --all'))
            .pipe($.size({title: 'release:rebase'}));
    }

    function tag(done) {
        return gulp.src('./')
            .pipe($.shell('git tag v' + argv.v))
            .pipe($.git.push('origin', '--tags'))
            .pipe($.size({title: 'release:tag'}));
    }

    ////////////////

    return tasks;
}

module.exports = release;
