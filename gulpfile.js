var gulp = require('gulp');
var server = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var mincss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var minhtml = require('gulp-htmlmin')


gulp.task('server', function() {
    gulp.src("src")
        .pipe(server({
            port: 8088, //端口号
            open: true,
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false
                }

                if (pathname === '/api/list') {
                    res.end(JSON.stringify(data))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;

                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//打包，压缩css
gulp.task('devSass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >=4.0']
        }))
        //压缩css
        .pipe(mincss())
        //输出到css
        .pipe(gulp.dest('build/css'))
})


//打包压缩js
gulp.task('uglify', function() {
    //
    gulp.src(['./src/js/*.js', '!./src/js/*.min.js'])
        //压缩js
        .pipe(uglify())
        //输出到build
        .pipe(gulp.dest('build/js'))

})

//打包压缩html
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
};
gulp.task('minhtml', function() {
    gulp.src('./src/**/*.html')
        .pipe(minhtml(options))
        .pipe(gulp.dest('build'))
})