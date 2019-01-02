// const browsersync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');

// // BrowserSync
// function browserSync(done) {
//   browsersync.init({
//     server: {
//       baseDir: './'
//     },
//     port: 3000
//   });
//   done();
// }

// // BrowserSync Reload
// function browserSyncReload(done) {
//   browsersync.reload();
//   done();
// }

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
  // .pipe(browsersync.stream());
}

function scripts() {
  gulp
    .src(['dev/js/**/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
  // .pipe(browsersync.stream());
}
function watch() {
  gulp.watch('dev/scss/**/*.scss', scss);
  gulp.watch('dev/js/**/*.js', scripts);
  //   gulp.watch(
  //     ['./dev/**/*', './models/**/*', './routers/**/*', './views/**/*'],
  //     gulp.series(browserSyncReload)
  //   );
}

// gulp.task('default', gulp.parallel(watch, browserSync));

gulp.task('default', watch);
