var gulp = require('gulp');
var through = require('through2');

gulp.task( 'default', function(){
    gulp.src('files/**/*.js')
        .pipe(through.obj(function( file, enc, cb ){
            console.log( 'pipe', file.path );
            cb();
        }));
})
