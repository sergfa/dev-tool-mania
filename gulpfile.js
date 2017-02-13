'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var del = require('del');
var header = require('gulp-header');

var pkg = require('./package.json');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');


gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('minify-css', function() {
    return gulp.src('css/main.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest('css'));
        
});

gulp.task('build', function (done) {
    return runSequence('sass', 'minify-css', done);
});