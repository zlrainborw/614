var gulp = require('gulp');
var rev = require("gulp-rev");
// var clean = require("gulp-clean");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var minCss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var sequence = require("gulp-sequence");
var server = require('gulp-webserver');

var data = require('./src/data/data.json');

var datas=require('./src/data/daticl.json')
gulp.task('css', function () {
    return gulp.src('./src/css/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ["last 2 versions", "Android >= 4.0"] }))
        .pipe(minCss())
        .pipe(rev())
        .pipe(gulp.dest("./src/css"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/css"))
});
gulp.task("js", function () {
    return gulp.src(["./src/js/*.js", "!./src/js/*.min.js"])
        .pipe(uglify())
        .pipe(concat("all.min.js"))
        .pipe(rev())
        .pipe(gulp.dest("./build/js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/js"))
});
gulp.task("copyjs", function () {
    return gulp.src("./src/js/*.min.js")
        .pipe(gulp.dest("./build/js"))
});

// gulp.task("html", function () {
//     return gulp.src(["./rev/**/*.json", "./src/*.html"])
//         .pipe(htmlmin(options))
//         .pipe(collector({ replaceReved: true }))
//         .pipe(gulp.dest("./build"))
// });

gulp.task("watch", function () {
    gulp.watch("./src/css/*.scss", ["css"]);
    gulp.watch("./src/js/*.js", ["js"]);
    gulp.watch("./src/*.html", ["html"]);
});
gulp.task('server', function () {
    gulp.src('./src')
        .pipe(server({
            port: 9090,
            open: true,
            middleware: function (req, res, next) {
                if (req.url == '/api/list') {
                    res.end(JSON.stringify(data))
                }
                if(req.url=='/api/daticl'){
                    res.end(JSON.stringify(datas))
                }
                next();
            }
        }))
})
gulp.task("default",function(callback){
	sequence(["css","js","copyjs"],["watch","server"],callback);
});