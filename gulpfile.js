var gulp = require('gulp');

gulp.task('default', function() {
	console.log("I have configured a gulpfile");
});

gulp.task('build', ['chrome', 'icons'], function() {
	console.log("Building.");
});

gulp.task('chrome', function() {
	return gulp.src("crx/*")
		.pipe(gulp.dest(".build/chrome"));
});

gulp.task('icons', function() {
	return gulp.src("content/icons/*")
		.pipe(gulp.dest(".build/chrome/icons"));
});