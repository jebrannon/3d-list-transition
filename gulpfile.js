var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var minifyjs = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

// Views task
gulp.task('html', function() {
  // Get our index.html
  gulp.src('src/html/index.html')
    .pipe(minifyhtml({comments: false}))
    .pipe(gulp.dest('bin/'));

  // Any other view files from src/html
  gulp.src('src/html/views/**/*')
    .pipe(minifyhtml({comments: false}))
    .pipe(gulp.dest('bin/html/'));
});

//  JSHint task
gulp.task('lint', function() {
  gulp.src('src/js/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

//  Libraries task
gulp.task('libs', function() {
  gulp.src(['src/js/libs/*.js'])
    .pipe(concat('libs-min.js'))
    .pipe(minifyjs())
    .pipe(gulp.dest('bin/js'));
});

//  Angular Compiler task
gulp.task('angular', function() {
  //  Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['src/js/app.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    //  Bundle to a single file
    .pipe(concat('app-min.js'))
    //  Minify
    .pipe(minifyjs())
    //  Output it to our production folder
    .pipe(gulp.dest('bin/js'));
});


gulp.task('images', function () {
  gulp.src(['src/images/*'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('bin/images'));
});



// Compile SCSS, compress CSS and output 'style.css'
gulp.task('styles', function () {
  gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(minifycss())
    .pipe(rename("styles.css"))
    .pipe(gulp.dest('bin/css'));
});

//  Setup server
gulp.task('server', function () {
  return browserSync.init(['*.html', 'css/*.css'], {
    server: {
      baseDir: './bin/'
    }
  });
});

//  Watch task
gulp.task('watch', function () {
  gulp.watch('src/**/*', ['compile']);
});

gulp.task('compile', ['html', 'lint', 'libs', 'angular', 'styles']);
gulp.task('default', ['compile', 'images', 'watch', 'server']);