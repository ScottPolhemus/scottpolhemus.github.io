var gulp = require('gulp');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

require('./tasks/less');
require('./tasks/browserify');

gulp.task('dev', ['less', 'watchify'], function() {
	livereload.listen();

	connect.server({
		livereload: false
	});

  gulp.watch(['**/*.less'], ['less']);

  gulp.watch([
    '**/*.html',
    'styles/*.css',
    'scripts/*.js'
  ], function(event) {
    livereload.changed(event.path);
  });
});

gulp.task('build', ['less', 'browserify']);

gulp.task('default', ['dev']);