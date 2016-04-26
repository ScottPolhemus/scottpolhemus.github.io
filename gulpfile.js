var gulp = require('gulp');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

require('./tasks/less');

gulp.task('dev', ['less'], function() {
	livereload.listen();

	connect.server({
		livereload: false
	});

  gulp.watch(['**/*.less'], ['less']);

  gulp.watch([
    '**/*.html',
    'styles/*.css'
  ], function(event) {
    livereload.changed(event.path);
  });
});

gulp.task('build', ['less']);

gulp.task('default', ['dev']);