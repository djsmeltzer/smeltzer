var gulp = require("gulp")
var less = require("gulp-less")
var sass = require("gulp-sass")
var autoprefix = require("gulp-autoprefixer")
var browserSync = require("browser-sync")
var rsync = require("gulp-rsync")
var sitemap = require("gulp-sitemap")
var imagemin = require("gulp-imagemin")
var twig = require("gulp-twig")
var cache = require("gulp-cache")
var cachebust = require("gulp-cache-bust")
var del = require('del')

gulp.task('clean', () => {
    return del(['dist/**/*','dist/.htaccess'])
})

gulp.task('less', () => {
    return gulp.src("src/less/**/*.less")
    .pipe(less())
    .pipe(autoprefix())
    .pipe(gulp.dest("src/css"));
})

gulp.task('sass', () => {
    return gulp.src("src/sass/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix())
        .pipe(gulp.dest("src/css"));
})

gulp.task("browserSync", () => {
    return browserSync.init({
        server: {
            baseDir: 'src',
            index: 'test-sass.html'
        }
    })
})

gulp.task('bubble', () => {
    return gulp.src("src/bubble/**/*")
        .pipe(gulp.dest('dist/bubble'));
})

gulp.task('quiz', () => {
    return gulp.src("src/quiz/**/*")
    .pipe(gulp.dest('dist/quiz'));
})

gulp.task('php', () => {
    return gulp.src("src/**/*.php")
    .pipe(gulp.dest("dist"))
})

gulp.task('htaccess', () => {
    return gulp.src('src/.htaccess')
    .pipe(gulp.dest("dist"))
})

gulp.task('template', () => {
    return gulp.src('src/templates/*.html')
    .pipe(twig())
    .pipe(gulp.dest('dist'))
})

gulp.task('sitemap', () => {
    return gulp.src(['dist/**/*.{html,php}'], {
        read: false
    })
    .pipe(sitemap({
        siteUrl: 'https://smeltzer.net'
    }))
    .pipe(gulp.dest('dist'));
})

gulp.task('svg', () => {
    return gulp.src("src/images/**/*.svg")
    .pipe(gulp.dest('dist/images'))
})

gulp.task('html:copy', gulp.series('template', () => {
    return gulp.src(['src/**/*.html', "!src/{templates,templates/**}"])
        .pipe(gulp.dest("dist"))
}))

gulp.task('html', gulp.series('html:copy', () => {
    return gulp.src('/dist/**/*.html')
        .pipe(cachebust())
        .pipe(gulp.dest('dist'))
}))

gulp.task('images', gulp.series('svg', () => {
    return gulp.src("src/images/**/*.{jpg,jpeg,gif,png}")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
}))

gulp.task("watch", gulp.series("browserSync", "less", "sass", () => {
    gulp.watch("src/less/**/*.less", ['less']);
    gulp.watch("src/sass/**/*.scss", ['sass']);
    return gulp.watch("src/**/*.{html,css,js,php}", browserSync.reload)
}))

gulp.task('build', gulp.series('html', 'php', 'htaccess', 'less', 'sass', 'images', 'bubble', 'quiz', () => {
    gulp.src(["src/robots.txt","src/manifest.json", "src/.htaccess", "src/serviceworker.js"])
    .pipe(gulp.dest("dist"));
    return gulp.src("src/css/**/*.css")
    .pipe(gulp.dest("dist/css"))
}))

gulp.task('push:live', gulp.series('sitemap',  () => {
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
    }))
}))