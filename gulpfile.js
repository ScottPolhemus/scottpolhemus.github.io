var gulp = require('gulp');
var livereload = require('gulp-livereload');

require('./tasks/sass');

gulp.task('default', ['sass'], function() {
  livereload.listen();

  gulp.watch(['**/*.scss'], ['sass']);

  gulp.watch([
    '**/*.html',
    'styles/*.css'
  ], function(event) {
    livereload.changed(event.path);
  });
});

gulp.task('build', ['sass']);