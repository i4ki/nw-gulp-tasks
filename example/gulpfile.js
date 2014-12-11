'use strict';

var gulp = require('gulp-tasks')({

    less: {
        compile: './src/assets/less/project.less',
        name: 'slug-module-name',
        srcs: './src/assets/less/**/*',
        bundle: [],
        dest: {
            css: './build/assets/css',
            less: './build/assets/less'
        }
    }

});
