var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('less', function() {
  return gulp.src('./styles/src/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./', {
      sourceRoot: 'src/',
      includeContent: false
    }))
    .pipe(gulp.dest('./styles'));
});