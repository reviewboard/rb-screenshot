var gulp = require('gulp');
var less = require('gulp-less')

gulp.task('default', ['build'], function() {
	console.log("Building Chrome and Firefox extensions.");
});

gulp.task('build', ['chrome', 'icons', 'html',
					'firefox', 'css', 'js'], function() {
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
		.pipe(gulp.dest(".build/chrome/css"))
		.pipe(gulp.dest(".build/firefox/data/css"));
});

gulp.task('js', function() {
	return gulp.src("content/*.js")
		.pipe(gulp.dest(".build/chrome"))
		.pipe(gulp.dest(".build/firefox/data"));
});

gulp.task('html', function() {
	return gulp.src("content/*.html")
		.pipe(gulp.dest(".build/chrome"))
		.pipe(gulp.dest(".build/firefox/data"));
});

gulp.task('firefox', function() {
	return gulp.src("xpi/*")
		.pipe(gulp.dest(".build/firefox"));
});