var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  del = require('del'),
  es = require('event-stream'),
  size = require('gulp-size'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-minify-html'),
  runSequence = require('run-sequence'),
  imageResize = require('gulp-image-resize'),
  rename = require("gulp-rename");

gulp.task('css', function () {
  var bootstrap = gulp.src('style/bootstrap.scss')
    .pipe(sass({
      includePaths: ["bower_components/bootstrap-sass/assets/stylesheets/bootstrap"],
      outputStyle: 'compressed'
    }))
    .pipe(size({title:'bootstrap.css'}));

  var tabmenu = gulp.src('style/tabmenu.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(size({title:'tabmenu.css'}));

  es.concat(bootstrap, tabmenu)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('clean', function (cb) {
  del(['./dist/**'], cb);
});

gulp.task('lint', function () {
  gulp.src('tabmenu.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy', function () {
  gulp.src('manifest.json').pipe(gulp.dest('./dist'));

  gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('minify', function () {
  gulp.src('tabmenu.js')
    .pipe(uglify())
    .pipe(size({title:'js'}))
    .pipe(gulp.dest('dist'));

  gulp.src('popup.html')
    .pipe(minifyHTML())
    .pipe(size({title:'html'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('icons', function () {
  var sizes = [128, 48, 19, 16];
  sizes.forEach(function (size) {
    gulp.src('assets/icon.png')
      .pipe(imageResize({width: size, height: size}))
      .pipe(rename(function (path) { path.basename += size; }))
      .pipe(gulp.dest('dist/assets'));
  });
});

gulp.task('build', function (cb) {
  runSequence('clean', ['css', 'lint', 'minify', 'copy', 'icons'], cb);
});
