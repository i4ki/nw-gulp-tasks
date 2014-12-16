# Gulp tasks

## Instalation

```
npm install gulp-tasks
```

## Usage

You need import this module and call constructor method with tasks you want enable. Each task have specific options, but have some globals options.

Example of standart call:

```
var gulp = require('./lib/nw-gulp-tasks')({

    less: {
        // options here
    },

    scripts: {
        //options here
    }
 
});
```

### The build task

By default, any taks is added in "build" tasks. To breack this standard, just add an "_" before task name, like so:

```
var gulp = require('./lib/nw-gulp-tasks')({

    less: {
        // options here
    },

    _scripts: {
        //options here
    }
 
});
```
- less inside, scripts out of the build task

### Subtasks

Some tasks files can have many subtasks. Maybe you need include only some subtasks. For this, all tasks have an option default called "tasks". This is an array with subtasks to enable.

```
 scripts: {
    _tasks: ['analysis']
 }
```
- This include "scripts:analysis" subtask only


