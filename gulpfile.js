const gulp = require('gulp');
const gzip = require('gulp-zip');
const mode = require('gulp-mode')();
const gformatHtml = require('gulp-format-html')

function formatHtml() {
  return gulp.src('dist/*.html')
    .pipe(gformatHtml({
      indent_size: 2,
      extra_liners: [],
      preserve_newlines: false,
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

exports.formatHtml = formatHtml;
exports.zip = zip;
exports.default = gulp.series(formatHtml);
