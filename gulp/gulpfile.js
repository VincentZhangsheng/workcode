var gulp 	  = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat 	  = require('gulp-concat'),
    uglify 	  = require('gulp-uglify'),
    rename 	  = require('gulp-rename');
//  del    	  = require('del');

	//压缩css
	gulp.task('minifycss', function() {
	    return gulp.src('public/Home/app/app-juooo4/css/myjuooo/*.css')      //压缩的文件
	        //.pipe(gulp.dest('public-version/Home/app/app-juooo4.2/css'))   //输出文件夹
	        .pipe(minifycss())   //执行压缩
			.pipe(gulp.dest('public-version/Home/app/app-juooo4/css/myjuooo/'));  //输出
	});
	
	
	gulp.task('pc-css', function() {
	    return gulp.src('public/Home/web/css/*.css')      //压缩的文件
	        .pipe(minifycss())   //执行压缩
	        .pipe(gulp.dest('public-version/Home/web/css/'));  //输出
	});

	gulp.task('pc-css4', function () {
		return gulp.src('public/Home/web-4.1.1/css/*.css') //压缩的文件
			.pipe(minifycss()) //执行压缩
			.pipe(gulp.dest('public-version/Home/web-4.1.1/css/')); //输出
	});

	//压缩js
	gulp.task('minifyjs', function() {
	    return gulp.src('public/Home/app/app-juooo4/js/*.js')
	        //.pipe(concat('main.js'))    //合并所有js到main.js
	        //.pipe(gulp.dest('public-version/Home/app/app-juooo4/js'))    //输出main.js到文件夹
	        //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
	        .pipe(uglify())    //压缩
	        .pipe(gulp.dest('public-version/Home/app/app-juooo4/js'));  //输出
	});

	//执行压缩前，先删除文件夹里的内容
//	gulp.task('clean', function(cb) {
//	    del(['public-version/Home/app/app-juooo4/css', 'public-version/Home/app/app-juooo4/js'], cb)
//	});

	//默认命令，在cmd中输入gulp后，执行的就是这个命令
gulp.task('default', ['minifycss']);

	//此命令会执行删除，暂时取消改为上面的
	/*gulp.task('default', ['clean'], function() {
	    gulp.start('minifycss', 'minifyjs');
	});*/