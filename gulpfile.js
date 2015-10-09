var gulp = require('gulp');
var less = require('gulp-less')

gulp.task('default', function() {
	console.log("I have configured a gulpfile");
});

gulp.task('build', ['chrome', 'icons', 'chrome-html',
					'firefox', 'css'], function() {
	console.log("Building.");
});

gulp.task('chrome', function() {
	return gulp.src("crx/*")
		.pipe(gulp.dest(".build/chrome"));
});

gulp.task('icons', function() {
	return gulp.src("content/icons/*")
		.pipe(gulp.dest(".build/chrome/icons"))
		.pipe(gulp.dest(".build/firefox/data"));
});

gulp.task('css', function() {
	return gulp.src("content/css/*.less")
		.pipe(less())
		.pipe(gulp.dest(".build/chrome/css"));
});

gulp.task('chrome-html', function() {
	return gulp.src("content/*.html")
		.pipe(gulp.dest(".build/chrome"));
});

gulp.task('firefox', function() {
	return gulp.src("xpi/*")
		.pipe(gulp.dest(".build/firefox"));
});