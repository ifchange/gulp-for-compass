gulp-for-compass
================

Gulp plugin for compass.

## Install

```
npm install gulp-for-compass
```

## Usage

```js
var gulp = require('gulp');
var compass = require( 'gulp-for-compass' );

gulp.task( 'default', function(){
    gulp.src('sass/*.scss')
        .pipe(compass({
            sassDir: 'sass',
            cssDir: 'css',
            force: true
        }));
})
```

For options to compass, checkout [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass#options).
