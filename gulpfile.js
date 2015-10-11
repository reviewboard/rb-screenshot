var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('default', ['build'], function() {
	console.log('Building Chrome and Firefox extensions.');
});

gulp.task('build', ['chrome', 'firefox'], function() {
	console.log('Building.');
});

gulp.task('chrome', ['chrome js', 'css', 'chrome html', 'images', 'js'],
		  function() {
	return gulp.src('crx/*')
		.pipe(gulp.dest('.build/chrome'));
});

gulp.task('chrome js', function() {
	return gulp.src('crx/js/*.js')
		.pipe(gulp.dest('.build/chrome/js'));
});

gulp.task('firefox', ['firefox js', 'css', 'firefox html', 'images', 'js'],
		  function() {
	return gulp.src(['xpi/*', '!xpi/js', '!xpi/*.html'])
		.pipe(gulp.dest('.build/firefox'));
});

gulp.task('firefox js', function() {
	return gulp.src('xpi/js/*.js')
		.pipe(gulp.dest('.build/firefox/data/js'));
});

gulp.task('css', function() {
	return gulp.src('content/css/*.less')
		.pipe(less())
		.pipe(gulp.dest('.build/chrome/css'))
		.pipe(gulp.dest('.build/firefox/data/css'));
});

gulp.task('chrome html', function() {
	return gulp.src('crx/*.html')
		.pipe(gulp.dest('.build/chrome'));
});

gulp.task('firefox html', function() {
	return gulp.src('xpi/*.html')
		.pipe(gulp.dest('.build/firefox/data'));
});

gulp.task('icons', function() {
	return gulp.src('content/images/icons/*')
		.pipe(gulp.dest('.build/chrome/images/icons'))
		.pipe(gulp.dest('.build/firefox/data/images/icons'));
});

gulp.task('images', ['icons'], function() {
	return gulp.src('content/images/*.png')
		.pipe(gulp.dest('.build/firefox/data/images'))
		.pipe(gulp.dest('.build/chrome/images'));
});

gulp.task('js', function() {
	return gulp.src('content/js/*.js')
		.pipe(gulp.dest('.build/chrome/js'))
		.pipe(gulp.dest('.build/firefox/data/js'));
});