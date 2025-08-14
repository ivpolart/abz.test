import fileinclude from "gulp-file-include";

export const html = () => {
	//Src
	return gulp.src(path.src.html)

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "HTML",
				message: "Error HTML: <%= error.message %>"
			})
		)
	)
	//File include
	.pipe(
		fileinclude()
	)
	//Dest
	.pipe(
		gulp.dest(path.build.html)
	)
	//Browser Sync
	.pipe(
		browsersync.stream()
	)
}