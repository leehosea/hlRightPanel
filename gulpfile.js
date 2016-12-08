/**
 * Created by HoseaLee on 16/12/7.
 */
/*
 sass的编译                  （gulp-ruby-sass）
 自动添加css前缀              （gulp-autoprefixer）
 压缩css                    （gulp-minify-css）
 js代码校验                  （gulp-jshint）
 合并js文件                  （gulp-concat）
 压缩js代码                  （gulp-uglify）
 压缩图片                    （gulp-imagemin）
 自动刷新页面                 （gulp-livereload）
 图片缓存，只有图片替换了才压缩  （gulp-cache）
 更改提醒                    （gulp-notify）
 清除文件                    （del）
 */

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    minify_css = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    uglify = require("gulp-uglify"),
    minimist = require("minimist");

gulp.task("move", ["move.jquery", "move.bootstrap3", "move.fontawesome"]);

gulp.task("move.jquery", function () {
    gulp.src("node_modules/jquery/dist/jquery.min.js")
        .pipe(gulp.dest('plugins/jquery/'));
});

gulp.task("move.bootstrap3", function () {
    gulp.src("node_modules/bootstrap3/dist/**/*")
        .pipe(gulp.dest("plugins/bootstrap3/"));
});

gulp.task("move.fontawesome", function () {
    gulp.src("node_modules/font-awesome/css/font-awesome.min.css")
        .pipe(gulp.dest("plugins/fontawesome"));
});

gulp.task("watch", function () {
    gulp.watch(["src/hlRightPanel.js", "src/hlRightPanel.css", "./example/*"]).on("change", function (file) {
        console.log("Watch Info: file " + file + "was changed");
    });
});

gulp.task("default", []);