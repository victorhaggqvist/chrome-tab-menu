var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require('del');
var es = require('event-stream');
var size = require('gulp-size');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var runSequence = require('run-sequence');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");
var exec = require('child_process').exec;
var babel = require("gulp-babel");

gulp.task('css', function() {
    var bootstrap = gulp.src('style/bootstrap.scss')
      .pipe(sass({
        includePaths: ["bower_components/bootstrap-sass/assets/stylesheets/bootstrap"],
        outputStyle: 'compressed'
      }));
      //.pipe(size({title:'bootstrap.css'}));

    var tabmenu = gulp.src('style/tabmenu.scss')
      .pipe(sass({outputStyle: 'compressed'}));
      //.pipe(size({title:'tabmenu.css'}));

    return es.concat(bootstrap, tabmenu)
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
    del(['./dist/**'], cb);
});

gulp.task('lint', function() {
    return gulp.src('tabmenu.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('copy', function() {
    gulp.src('manifest.json').pipe(gulp.dest('./dist'));
    gulp.src('assets/volume-up.png').pipe(gulp.dest('./dist'));
    gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*').pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/mithril/mithril.min.js').pipe(gulp.dest('./dist'));
    gulp.src('./bower_components/echojs/dist/echo.min.js').pipe(gulp.dest('./dist'));
});

gulp.task('copy:dist', ['copy']);

gulp.task('copy:debug', ['copy'], function() {
    gulp.src('tabmenu.js').pipe(gulp.dest('./dist'));
    gulp.src('popup.html').pipe(gulp.dest('./dist'));

    gulp.src("tabmenu.js")
    .pipe(babel({
      "presets": ["es2015"],
      "plugins": ["transform-es2015-arrow-functions"]
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task('minify', function() {
    gulp.src('tabmenu.js')
      .pipe(uglify())
      .pipe(size({title:'js'}))
      .pipe(gulp.dest('dist'));

    //gulp.src('popup.html')
      //.pipe(minifyHTML())
      //.pipe(size({title:'html'}))
      //.pipe(gulp.dest('dist'));
});

gulp.task('icons', function() {
    var sizes = [16, 19, 38, 48, 128];

    sizes.forEach(size => {
        exec('inkscape --without-gui --export-png=dist/assets/icon'+size+'.png --export-width='+size+' --export-height='+size+' assets/icon.svg', (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
        });
    });
});

gulp.task('build:dist', ['css', 'lint', 'minify', 'copy:dist', 'icons']);
gulp.task('build', ['css', 'lint', 'copy:debug']);
