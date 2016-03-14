var gulp = require('gulp');
var uglify = require('gulp-uglify');
var markdown = require('gulp-markdown');

var minifycss = require('gulp-minify-css');

var less = require('gulp-less');
var path = require('path');


gulp.task('less', function () {
  return gulp.src('./static/less/*.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest('./static/css'));
});


gulp.task('md', function () {
   gulp.src('doc/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('views'));
});

gulp.task('minify', function () {
   gulp.src('static/js/app.js')
      .pipe(uglify())
      .pipe(gulp.dest('build/js'))
});

gulp.task('default', function(){
    gulp.run('minify','md','less');
    
    gulp.watch('dic/*.md', function(){
        gulp.run('md');
    });
    gulp.watch('./static/less/**/*.less', function(){
        gulp.run('less');
    });

});