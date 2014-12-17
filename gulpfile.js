var path = require('path');
var exec = require('child_process').exec;

var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var prettify = require('gulp-html-prettify');
var stylus = require('gulp-stylus');
var tap = require('gulp-tap');
var yate = require('gulp-yate');

gulp.task('default', ['build', 'connect', 'watch']);

gulp.task('build', ['html', 'style.css', 'beautify']);

gulp.task('blocks.yate', function () {
    gulp.src(['./blocks/externals.yate', './blocks/*/*.yate'])
        .pipe(tap(function (file, t) {
            file.contents = new Buffer('include "' + file.path + '"');
        }))
        .pipe(concat('./blocks.yate'))
        .pipe(gulp.dest('./blocks/'));
});

gulp.task('blocks.styl', function () {
    gulp.src(['./blocks/*/*.styl'])
        .pipe(tap(function (file, t) {
            file.contents = new Buffer('@import "' + file.path + '"');
        }))
        .pipe(concat('./blocks.styl'))
        .pipe(gulp.dest('./blocks/'));
});

gulp.task('html', ['blocks.yate'], function () {
    gulp.src(['./pages/*.yate'])
        .pipe(yate({ dir: './', json: './empty.json', externals: './blocks/externals.yate.js' }))
        .pipe(connect.reload());
});

gulp.task('style.css', ['blocks.styl'], function () {
    exec('make static', function (err) {
        if (err) {
            console.log('\033[31mSomething went wrong\033[91m ');
        }
        connect.reload();
    });
});

gulp.task('beautify', function () {
    gulp.src('./*.html')
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest('./'));
});

gulp.task('connect', function () {
    connect.server({
        root: path.resolve('./'),
        port: 8080,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['./blocks/*/*.yate', './pages/*.yate'], ['html']);
    gulp.watch(['./blocks/*/*.styl'], ['style.css']);
});
