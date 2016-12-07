var gulp = require("gulp");
var less = require("gulp-less");
var nano = require("gulp-cssnano");
var autoprefix = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var rsync = require("gulp-rsync");

gulp.task('less', function() {
    return gulp.src("src/less/**/*.less")
    .pipe(less())
    .pipe(autoprefix())
    .pipe(gulp.dest("src/css"));
});

gulp.task("watch", ["browserSync"], function() {
    gulp.watch("src/less/**/*.less", ['less']);
    gulp.watch("src/**/*.{html,css,js}", browserSync.reload);
})

gulp.task("browserSync", function() {
    browserSync.init({
        server: {
            baseDir: 'src',
            index: 'test2.html'
        }
    })
});

gulp.task('build', ['less'], function() {
    gulp.src("src/**/*.html")
    .pipe(gulp.dest('live'));
    gulp.src("src/images/**/*.{jpg,jpeg,gif,png}")
    .pipe(gulp.dest('live/images'));
    return gulp.src("src/css/**/*.css")
    .pipe(nano())
    .pipe(gulp.dest("live/css"));
})

gulp.task('push:live', ['build'], function () {
    return gulp.src("live/**")
    .pipe(rsync({
        hostname: "smeltzer",
        username: "serenity",
        destination: "public_html",
        root: "live/",
        silent: false,
        archive: true,
        compress: true,
        verbose: true,
        chmod: "Du=rxw,Dgo=rx,Fu=rw,Fog=r"
    }));
});