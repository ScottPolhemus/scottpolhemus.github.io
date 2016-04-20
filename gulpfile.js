var gulp = require('gulp');
var livereload = require('gulp-livereload');

require('./tasks/less');

gulp.task('default', ['less'], function() {
  livereload.listen();

  gulp.watch(['**/*.less'], ['less']);

  gulp.watch([
    '**/*.html',
    'styles/*.css'
  ], function(event) {
    livereload.changed(event.path);
  });
});

gulp.task('build', ['less']);