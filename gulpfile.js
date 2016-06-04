require('dotenv').config();

const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');

gulp.task('lint', function() {

  return gulp.src(['**/*.js','!node_modules/**', '!main.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format());

})

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify('src/_main.js')
    .transform("babelify", {presets: ['es2015', 'react']});

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());

});

gulp.task('default', ['lint', 'js']);

gulp.task('watch', function() {

  browserSync.init({
    proxy: 'http://localhost:' + process.env.PORT,
    port: (parseInt(process.env.PORT, 10) + 1)
  });

  gulp.watch(['src/**/*.js'], ['js']);
  gulp.watch(['src/**/*.less'], ['css']);
  gulp.watch(['views/**/*.hbs']).on('change', browserSync.reload);

});
