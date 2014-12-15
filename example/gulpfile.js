'use strict';

var gulp = require('./lib/nw-gulp-tasks')({

    less: {
        compile: './src/assets/less/project.less',
        name: 'slug-module-name',
        srcs: './src/assets/less/**/*',
        bundle: [],
        dest: {
            css: './build/assets/css',
            less: './build/assets/less'
        }
    },

    scripts: {
        name: 'slug-module-name',
        srcs: './src/modules/**/*.js',
        bundle: [],
        dest: {
            tmp: './tmp',
            js: './build/js'
        }
    },

    _release: {}

});
