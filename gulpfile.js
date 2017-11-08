var gulp = require("gulp");
var less = require("gulp-less");
var sass = require("gulp-sass");
var nano = require("gulp-cssnano");
var autoprefix = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var rsync = require("gulp-rsync");
var sitemap = require("gulp-sitemap");

gulp.task('less', function() {
    return gulp.src("src/less/**/*.less")
    .pipe(less())
    .pipe(autoprefix())
    .pipe(gulp.dest("src/css"));
});

gulp.task('sass', function() {
    return gulp.src("src/sass/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix())
        .pipe(gulp.dest("src/css"));
});

gulp.task("watch", ["browserSync", "less", "sass"], function() {
    gulp.watch("src/less/**/*.less", ['less']);
    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/**/*.{html,css,js,php}", browserSync.reload);
})

gulp.task("browserSync", function() {
    browserSync.init({
        server: {
            baseDir: 'src',
            index: 'test-sass.html'
        }
    })
});

gulp.task('build', ['less', 'sitemap', 'sass'], function() {
    gulp.src("src/**/*.{html,php}")
    .pipe(gulp.dest('dist'));
    gulp.src("src/bubble/**/*")
        .pipe(gulp.dest('dist/bubble'));
    gulp.src("src/images/**/*.{jpg,jpeg,gif,png}")
    .pipe(gulp.dest('dist/images'));
    gulp.src("src/robots.txt")
    .pipe(gulp.dest("dist"));
    return gulp.src("src/css/**/*.css")
    .pipe(nano())
    .pipe(gulp.dest("dist/css"));
})

gulp.task('sitemap', function() {
    gulp.src('src/**/*.html', {
        read: false
    })
    .pipe(sitemap({
        siteUrl: 'https://smeltzer.net'
    }))
    .pipe(gulp.dest('dist'));
})

gulp.task('push:live', ['build'], function () {
    return gulp.src("dist/**")
    .pipe(rsync({
        hostname: "smeltzer",
        username: "smeltzer",
        destination: "public_html",
        root: "dist/",
        silent: false,
        archive: true,
        compress: true,
        verbose: true,
        chmod: "Du=rxw,Dgo=rx,Fu=rw,Fog=r"
    }));
});