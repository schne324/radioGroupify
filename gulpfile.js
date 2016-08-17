'use strict';

var path = require('path');
var gulp = require('gulp');
var shell = require('gulp-shell');
var BUILD_DIR = 'build';

gulp.task('default', ['scripts']);

gulp.task('scripts', function () {
	gulp.src(path.join('src', '**/*.js'))
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('test', shell.task([
	'mocha-phantomjs test/index.html'
]));
