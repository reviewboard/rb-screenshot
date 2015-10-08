var gulp = require('gulp');

gulp.task('default', function() {
	console.log("I have configured a gulpfile");
});

gulp.task('build', ['chrome', 'chrome-icons', 'firefox',
					'firefox-icons'], function() {
	console.log("Building.");
});

gulp.task('chrome', function() {
	return gulp.src("crx/*")
		.pipe(gulp.dest(".build/chrome"));
});

gulp.task('chrome-icons', function() {
	return gulp.src("content/icons/*")
		.pipe(gulp.dest(".build/chrome/icons"));
});

gulp.task('firefox', function() {
	return gulp.src("xpi/*")
		.pipe(gulp.dest(".build/firefox"));
});

gulp.task("firefox-icons", function() {
	return gulp.src("content/icons/*")
		.pipe(gulp.dest(".build/firefox/data"));
});