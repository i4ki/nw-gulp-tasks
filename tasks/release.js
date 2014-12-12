'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var _ = require('lodash');

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

        var bump = (argv.v !== undefined && argv.v !== pkg.version);
        var message = '[CHANGE] - Bump bower.json and package.json';
        var options = {};

        if (bump) {
            options.version = argv.v;
        }

        return gulp.src([
                './bower.json',
                './package.json'
            ])
            .pipe($.if(bump, $.bump(options)))
            .pipe(gulp.dest('./'))
            .pipe($.git.add())
            .pipe($.git.commit(message))
            .pipe($.size({title: 'release:bump'}));
    }

    function rebase(done) {
        return gulp.src('./')
            .pipe($.git.checkout('master'))
            .pipe($.git.merge('develop'))
            .pipe($.git.checkout('develop'))
            .pipe($.git.push('origin', '--all'))
            .pipe($.size({title: 'release:rebase'}));
    }

    function tag(done) {
        var version = (argv.v !== undefined) ? argv.v : pkg.version;

        return gulp.src('./')
            .pipe($.shell('git tag v'+version))
            .pipe($.git.push('origin', '--tags'))
            .pipe($.size({title: 'release:tag'}));
    }

    ////////////////

    return tasks;
}

module.exports = release;
