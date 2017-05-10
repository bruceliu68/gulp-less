var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),
    clean = require('del'),
    path = require('path'),
    fileinclude = require('gulp-file-include'),//引用文件
    minifycss = require('gulp-minify-css'),//压缩css
    uglify = require('gulp-uglify'),//压缩js
    imagemin = require('gulp-imagemin'),//压缩图片
    rev = require('gulp-rev'),//- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector');//- 路径替换

//样式处理
gulp.task('compileLess', function () {
    return gulp.src(['less/*.less', 'less/*/*.less','less/*/*/*.less']) //该任务针对的文件
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        })) //该任务调用的模块
        .pipe(minifycss())//压缩css文件
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())					 //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css'));
});

gulp.task('rev',['compileLess','fileinclude'],function() {
    return gulp.src(['./rev/css/*.json', './dist/page/*/*.html'])
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())
        //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/page'));
    //- 替换后的文件输出的目录
});

//图片压缩处理
gulp.task('img', function () {
    return gulp.src(['image/*/*.png','image/*/*.jpg']) //该任务针对的文件
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'));
});

//压缩js
gulp.task('minifyjs',function() {
    return gulp.src(['js/*.js', 'js/*/*.js'])
        // .pipe(uglify())    //压缩
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())					 //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/js'));
});
gulp.task('revjs',['rev','minifyjs'],function() {
    return gulp.src(['./rev/js/*.json', './dist/page/*/*.html'])
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())
        //- 执行文件内css名的替换
        .pipe(gulp.dest('./dist/page'));
    //- 替换后的文件输出的目录
});

//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function(){
    return clean(['dist/css','dist/js','dist/page','dist/image']);
});

//html处理
gulp.task('fileinclude', function() {
    return gulp.src(['template/*.html','template/*/*.html', 'template/*/*/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/page'));
});
//监听html处理
gulp.task('fileinclude2',['compileLess','minifyjs'], function() {
    return gulp.src(['template/*.html','template/*/*.html', 'template/*/*/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/page'));
});

//监听改动
gulp.task('watch', ['default'], function () {//监听文件内容的变动
    // gulp.watch('less/**/*.less', ['compileLess']);
    // gulp.watch('template/**/*.html', ['fileinclude']);
    // gulp.watch('js/**/*.js', ['minifyjs']);
    // gulp.watch(['image/**/*.png','image/**/*.jpg'], ['img']);
    var watcher = gulp.watch(['image/**/*','less/**/*.less','template/**/*.html','js/**/*.js'],['img','revjs']);
    watcher.on('change', function (event) {
        if (event.type === 'deleted') {
            clean.sync('dist');
            console.log('success');
        }
    });
});

gulp.task('default', ['clean'], function(){
    gulp.start('img','revjs');
});