'use strict';

var gulp = require('./index')({

    scripts: {
        _tasks: ['analysis'],
        srcs: './tasks/**/*.js',
    },

    _release: {}

});
