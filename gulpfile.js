const gulp = require('gulp');
const gzip = require('gulp-zip');
const mode = require('gulp-mode')();
const gFormatHtml = require('gulp-format-html');

const dist = (path = '') => {
  return 'dist' + path;
};

function formatHtml() {
  return gulp
    .src(dist('/*.html'))
    .pipe(
      gFormatHtml({
        indent_size: 2,
        extra_liners: [],
        preserve_newlines: false,
        end_with_newline: true,
      })
    )
    .pipe(gulp.dest(dist()));
}

function zip() {
  return gulp
    .src(dist('/**/*'))
    .pipe(mode.development(gzip('build.zip')))
    .pipe(mode.production(gzip('build.min.zip')))
    .pipe(gulp.dest('build'));
}

exports.formatHtml = formatHtml;
exports.zip = zip;
exports.default = gulp.series(formatHtml);
