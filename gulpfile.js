const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');

function scss() {
  return gulp
    .src('dev/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {
        cascade: true
      })
    )
    .pipe(cssnano())
    .pipe(gulp.dest('public/css'));
}

function scripts() {
  gulp
    .src(['dev/js/**/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
}
function watch() {
  gulp.watch('dev/scss/**/*.scss', scss);
  gulp.watch('dev/js/**/*.js', scripts);
}
gulp.task('default', watch);
