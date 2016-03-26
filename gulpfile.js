var gulp = require('gulp');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var exec = require('child_process').exec;
var webpack = require('webpack-stream');

gulp.task('style', function() {
    return gulp.src('style/tabmenu.scss')
        .pipe(sass({
            includePaths: ["node_modules/bootstrap-sass/assets/stylesheets/bootstrap"],
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./out/'));
});

gulp.task('lint', function() {
    return gulp.src('./src/*.jsx')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('copy', function() {
    gulp.src('./manifest.json').pipe(gulp.dest('./out'));
    gulp.src('./assets/volume-up.png').pipe(gulp.dest('./out'));
    gulp.src('./node_modules/react/dist/react.min.js').pipe(gulp.dest('./out'));
    gulp.src('./node_modules/react-dom/dist/react-dom.min.js').pipe(gulp.dest('./out'));
    gulp.src('./src/popup.html').pipe(gulp.dest('./out'));
    gulp.src('./assets/icon.png').pipe(gulp.dest('./out'));

});

var webpackConfig = {
    entry: './src/TabMenu.jsx',
    output: { filename: 'TabMenu.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};

gulp.task('pack:watch', function() {
    webpackConfig.watch = true;
    return gulp.src('./src/TabMenu.jsx')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./out'));
});

gulp.task('pack', function() {
    return gulp.src('./src/TabMenu.jsx')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./out'));
});

gulp.task('pack:min', function() {
    return gulp.src('./src/TabMenu.jsx')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('./out'));
});

gulp.task('clean', function() {
    exec('rm -r out', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task('zip', ['pack:min', 'copy', 'style'], function() {
//gulp.task('zip', function() {
    var man = require('./manifest.json');
    var name = 'out_'+man.version+'_'+Date.now()+'.zip';
    console.log('zipping as', name);

    exec('zip -r '+name+' * && mv ./'+name+' ../',{cwd: './out'}, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
    });
});
