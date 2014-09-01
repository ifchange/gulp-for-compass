'use strict';

var fs = require('fs');
var compass = require('compass-compiler');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var PLUGIN_NAME = 'gulp-for-compass';

module.exports = function(opt) {

    var isCompiling = false;
    var compiled = false;
    var compiledArgs = [];
    var needToCompile = false;
    var callbacks = [];

    var compile = function(file, enc, cb) {

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        if (path.basename(file.path)[0] === '_') {
            return cb();
        }

        // Then is sass file needed to be compile
        needToCompile = true;

        var callback = function( err, result, code ){

            if( err ){
                if (code === 127) {
                    return cb(new gutil.PluginError(PLUGIN_NAME, 'You need to have Ruby and Compass installed ' +
                        'and in your system PATH for this task to work.'));
                }
                // `compass compile` exits with 1 and outputs "Nothing to compile"
                // on stderr when it has nothing to compile.
                // https://github.com/chriseppstein/compass/issues/993
                else if (code === 1 && !/Nothing to compile|Compass can't find any Sass files to compile/g.test(result.stderr)) {
                    gutil.log( PLUGIN_NAME, 'Nothing to compile' );
                    return cb( null );
                }
                else {
                    return cb(new gutil.PluginError(PLUGIN_NAME, err || 'Compass failed ' , {fileName: file.path}));
                }
            }
            else {
                // excute callback
                var relativePath = path.relative( path.join( process.cwd(), opt.sassDir ), file.path );
                var pathToCss = path.resolve( path.join( process.cwd(), opt.cssDir ), relativePath );
                pathToCss = gutil.replaceExtension( pathToCss, '.css');
                var contents = fs.readFileSync(pathToCss);

                // Fix garbled output.
                if (!(contents instanceof Buffer)) {
                    contents = new Buffer(contents);
                }

                file.path = pathToCss;
                file.contents = contents;

                cb(null, file);
            }
        };

        // If it is compiling, save cb.
        if( isCompiling ){
            callbacks.push( callback );
        }
        // If already finish compiling, execute cb immediately.
        else if( compiled ){
            callback.apply( this, compiledArgs );
        }
        // Then begin to compile
        else {
            compass.compile( opt, function() {

                // Save compile result.
                isCompiling = false;
                compiled = true;
                compiledArgs = arguments;

                // Execute all callbacks.
                callbacks.forEach( function( cb ){
                    cb.apply( this, compiledArgs );
                })
            });

            callbacks.push( callback );
            isCompiling = true;
        }
    };

    return through.obj(compile);
};