import uglify from 'gulp-uglify';

//Finished text
const finishedText = (title, file) => {
	let end = performance.now();
	let duration = end - file.startTime;
	let timestamp = new Date().toLocaleTimeString();
	let time = color.magenta(timestamp)
	let dur = color.green(duration.toFixed(2))
	let fileName = color.cyan(file.relative)

	return console.log(`[${time}] - Finished '${title}': '${fileName}' after ${dur} ms`);
};

//copy JQuerry librarry if need
export const copy_jq = () => {
	return gulp.src(path.src.jQuerry)
	.pipe(gulp.dest(path.build.js))
}

//main JS
export const js = () => {
	//Src
	return gulp.src(path.src.js)

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "JS",
				message: "Error JS: <%= error.message %>"
			})
		)
	)
	//Build ==> Minify JS
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			tap((file) => {
				file.startTime = performance.now()
			})
		)
	)
	//JS
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			uglify()
		)
	)
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			tap((file) => {
				console.log(file.contents.length)
				finishedText('Minify JS', file)
			})
		)
	)
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			rename({ suffix: '.min' })
		)
	)
	//Dest
	.pipe(
		gulp.dest(path.build.js)
	)
	//Browser Sync
	.pipe(
		browsersync.stream()
	)
}