var gulp = require("gulp");
var less = require("gulp-less");
var sass = require("gulp-sass");
var nano = require("gulp-cssnano");
var autoprefix = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var rsync = require("gulp-rsync");
var sitemap = require("gulp-sitemap");
var imagemin = require("gulp-imagemin");
var twig = require("gulp-twig");
var cache = require("gulp-cache");
var cachebust = require("gulp-cache-bust");
var del = require('del');

gulp.task('clean', function() {
    return del(['dist/**/*','dist/.htaccess'])
})

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

gulp.task('build', ['html', 'php', 'less', 'sass', 'images', 'bubble'], function() {
    gulp.src(["src/robots.txt","src/manifest.json", "src/.htaccess", "src/serviceworker.js"])
    .pipe(gulp.dest("dist"));
    return gulp.src("src/css/**/*.css")
    .pipe(nano())
    .pipe(gulp.dest("dist/css"));
})

gulp.task('bubble', function() {
    return gulp.src("src/bubble/**/*")
        .pipe(gulp.dest('dist/bubble'));
})

gulp.task('php', function() {
    return gulp.src("src/**/*.php")
        .pipe(gulp.dest("dist"))
})

gulp.task('template', function() {
    return gulp.src('src/templates/*.html')
        .pipe(twig())
        .pipe(gulp.dest('dist'))
})

gulp.task('html:copy', ['template'], function() {
    return gulp.src(['src/**/*.html', "!src/{templates,templates/**}"])
        .pipe(gulp.dest("dist"))
})

gulp.task('html', ['template','html:copy'], function() {
    return gulp.src('/dist/**/*.html')
        .pipe(cachebust())
        .pipe(gulp.dest('dist'));
})

gulp.task('sitemap', function() {
    return gulp.src(['dist/**/*.{html,php}'], {
        read: false
    })
    .pipe(sitemap({
        siteUrl: 'https://smeltzer.net'
    }))
    .pipe(gulp.dest('dist'));
})

gulp.task('svg', function() {
    return gulp.src("src/images/**/*.svg")
        .pipe(gulp.dest('dist/images'));
})

gulp.task('images', ['svg'], function() {
    return gulp.src("src/images/**/*.{jpg,jpeg,gif,png}")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
})

gulp.task('push:live', ['sitemap'], function () {
    return gulp.src(["dist/**","dist/.htaccess"])
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