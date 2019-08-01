var gulp = require('gulp');
var umd = require('gulp-umd');
var terser = require('gulp-terser');
var headerComment = require('gulp-header-comment');

gulp.task('build', () =>
	gulp.src('src/*.js')
		.pipe(umd({
			exports: () => 'VueOnClickout',
			namespace: () => 'VueOnClickout'
		}))
		.pipe(gulp.dest('test/'))
		.pipe(terser())
		.pipe(headerComment(`
			<%= pkg.name %> v<%= pkg.version %>
			(c) <%= moment().format('YYYY') %> Mu-Tsun Tsai
			Released under the MIT License.
		`))
		.pipe(gulp.dest('lib/'))
);

gulp.task('watch', () => {
	gulp.watch('src/**/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build', 'watch'));