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
var pug         = require('gulp-pug');

gulp.task('clean', function() {
	return del(["dist", "build"]);
});

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./build/css'));
});

gulp.task('minify-css', function() {
	return gulp.src('build/css/main.css')
		.pipe(cleanCSS({debug: true}, function(details) {
			console.log(details.name + ': ' + details.stats.originalSize);
			console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(rename("main.min.css"))
		.pipe(gulp.dest('dist/css'));
		
});


gulp.task('templates', function() {
	return gulp.src(['views/pages/*.pug'])
		.pipe(pug())
		.pipe(gulp.dest('dist/'));
});


gulp.task('copy-resources', function() {
	return gulp.src(['img/**/*'], { "base" : "." }).pipe(gulp.dest('dist'));
});

gulp.task('copy-css', function() {
	return gulp.src(['css/**/*'], { "base" : "." }).pipe(gulp.dest('dist'));
});

gulp.task('copy-js-lib', function() {
	return gulp.src(['js/lib/*.js'], { "base" : "." }).pipe(gulp.dest('dist'));
});


gulp.task('js-json-page', function() {
    return gulp.src(['js/utils.js','js/json-tool.js', '!js/lib/*.js'])
        .pipe(concat("main.js"))
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/json'));
});

gulp.task('js-css-page', function() {
    return gulp.src(['js/utils.js','js/css-tool.js', '!js/lib/*.js'])
        .pipe(concat("main.js"))
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/css'));
});

gulp.task('js-js-page', function() {
    return gulp.src(['js/utils.js','js/js-tool.js', '!js/lib/*.js'])
        .pipe(concat("main.js"))
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/js'));
});


gulp.task('js-html-page', function() {
    return gulp.src(['js/utils.js','js/html-tool.js', '!js/lib/*.js'])
        .pipe(concat("main.js"))
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/html'));
});


gulp.task('contact-html-page', function() {
    return gulp.src(['js/contact.js', '!js/lib/*.js'])
        .pipe(concat("main.js"))
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/contact'));
});

gulp.task('lint', function() {
	return gulp.src(['js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter("fail"));
});


gulp.task('build', function (done) {
	return runSequence('clean', 'lint', 'sass', 'minify-css', 'copy-resources','copy-js-lib','js-json-page','js-css-page','js-html-page' , 'js-js-page','contact-html-page', 'copy-css', 'templates', done);
});


