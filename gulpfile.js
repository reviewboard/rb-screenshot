var browserify = require('browserify');
var gulp = require('gulp');
var less = require('gulp-less');
var source = require('vinyl-source-stream');

gulp.task('default', ['build'], function() {
	console.log('Building Chrome and Firefox extensions.');
});

gulp.task('build', ['chrome', 'firefox'], function() {
	console.log('Building.');
});

gulp.task('chrome', ['chrome js', 'css', 'chrome html', 'images', 'js', 'html',
					 'browserify'],
		  function() {
	return gulp.src('crx/*')
		.pipe(gulp.dest('.build/chrome'));
});

gulp.task('chrome js', function() {
	return gulp.src('crx/js/*.js')
		.pipe(gulp.dest('.build/chrome/js'));
});

gulp.task('firefox', ['firefox js', 'css', 'firefox html', 'images', 'js', 'html',
					  'browserify'],
		  function() {
	return gulp.src(['xpi/*', '!xpi/js', '!xpi/*.html'])
		.pipe(gulp.dest('.build/firefox'));
});

gulp.task('firefox js', function() {
	return gulp.src('xpi/js/*.js')
		.pipe(gulp.dest('.build/firefox/data/js'));
});

gulp.task('browserify', function() {
	var bundle_stream = browserify(
	{
		entries: 'content/js/screenshot.js',
		standalone: 'screenshot',
	});
	return bundle_stream
		.bundle()
		.pipe(source('screenshot.js'))
		.pipe(gulp.dest('.build/chrome/js'))
		.pipe(gulp.dest('.build/firefox/data/js'));
})

gulp.task('css', ['less'], function() {
	return gulp.src('content/css/*.css')
		.pipe(gulp.dest('.build/chrome/css'))
		.pipe(gulp.dest('.build/firefox/data/css'));
});

gulp.task('less', function() {
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

gulp.task('html', function() {
	return gulp.src('content/*.html')
		.pipe(gulp.dest('.build/chrome'))
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