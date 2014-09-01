var gulp = require('gulp');
var compass = require( '../index' );

gulp.task( 'default', function(){
    gulp.src('sass/*.scss')
        .pipe(compass({
            sassDir: 'sass',
            cssDir: 'css',
            force: true
        }));
})