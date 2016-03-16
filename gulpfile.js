var gulp = require('gulp');
var uglify = require('gulp-uglify');
var markdown = require('gulp-markdown');

var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var path = require('path');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');

gulp.task('less', function () {
  return gulp.src('./seed/less/*.less')
      .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            gutil.beep();
            this.emit('end');
        }))
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest('./seed/css'));
});


gulp.task('md', function () {
   gulp.src('doc/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('./seed/views'));
});

gulp.task('webserver', function() {
  gulp.src('./seed/')
    .pipe(webserver({
      fallback: './index.html',
      livereload: true,
      port: 8360,
      directoryListing: false,
      open: true
    }));
});

//gulp.task('minify', function () {
//   gulp.src('static/js/app.js')
//      .pipe(uglify())
//      .pipe(gulp.dest('build/js'))
//});

gulp.task('default', function(){
   
    gulp.run('webserver');
   
    gulp.watch('doc/*.md', function(){
        gulp.run('md');
    });
    gulp.watch('./seed/less/**/*.less', function(){
        gulp.run('less');
    });

});