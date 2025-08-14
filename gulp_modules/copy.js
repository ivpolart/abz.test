export const copy = () => {
	return gulp.src(path.src.copy, { encoding: false })

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "DATA",
				message: "Error DATA: <%= error.message %>"
			})
		)
	)
	//Copy
	.pipe(
		gulp.dest(path.build.html)
	)
	//Browser Sync
	.pipe(
		browsersync.stream()
	)
}