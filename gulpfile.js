require('dotenv').config();

const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

gulp.task('css', function() {
  gulp.src('./src/_main.scss')
    .pipe(rename('style.css'))
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src('./src/icons/fonts/**')
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {

  return gulp.src(['**/*.js','!node_modules/**', '!dist/**/*.js'])
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


gulp.task('watch', function () {

  gulp.watch(['src/**/*.scss'], ['css']);
  gulp.watch(['src/**/*.js', 'components/**/*.js'], ['js']);
  gulp.watch(['**/*.hbs'], browserSync.reload);

  return nodemon({

    // nodemon our expressjs server
    script: 'bin/www',

    // watch all js, hbs and scss files
    watch: ['app.js', 'routes/**/*.js', 'models/**/*.js', 'components/**/*.js']

  })
  .once('start', function() {
    browserSync.init({
      proxy: 'http://localhost:' + process.env.PORT,
      port: (parseInt(process.env.PORT, 10) + 1)
    });
  }).on('restart', browserSync.reload);

});



gulp.task('default', ['css', 'fonts', 'lint', 'js']);
