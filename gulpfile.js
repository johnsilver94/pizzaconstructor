const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function scss() {
  return gulp
    .src('dev/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: true
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'));
}

function scripts() {
  return gulp
    .src(['dev/js/**/*.js'])
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(terser())
    .pipe(gulp.dest('public/js'));
}

function watch() {
  gulp.watch('dev/scss/**/*.scss', scss);
  gulp.watch('dev/js/**/*.js', scripts);
}

const build = gulp.parallel(scss, scripts);

gulp.task('scss', scss);
gulp.task('scripts', scripts);
gulp.task('build', build);
gulp.task('default', gulp.series(build, watch));

module.exports = {
  scss,
  scripts,
  build,
  watch,
  default: gulp.series(build, watch)
};
