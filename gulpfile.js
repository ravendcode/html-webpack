const gulp = require('gulp');
const beautify = require('gulp-beautify');
const prettier = require('gulp-prettier');
const gzip = require('gulp-zip');
const mode = require('gulp-mode')();

function beautifyHtml() {
  return gulp.src('dist/*.html')
    .pipe(prettier({
      htmlWhitespaceSensitivity: 'ignore',
      printWidth: 128
    }))
    .pipe(beautify.html({
      indent_size: 2,
      extra_liners: [],
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(gulp.dest('dist'));
}

function zip() {
  return gulp.src('dist/**/*')
    .pipe(mode.development(gzip('dev.zip')))
    .pipe(mode.production(gzip('prod.zip')))
    .pipe(gulp.dest('build'));
}

exports.beautifyHtml = beautifyHtml;
exports.zip = zip;
exports.default = gulp.series(beautifyHtml);
