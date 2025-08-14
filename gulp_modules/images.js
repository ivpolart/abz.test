import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

export const images = () => {
	return gulp.src(path.src.images, { encoding: false })

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "IMAGES",
				message: "Error IMG: <%= error.message %>"
			})
		)
	)
	//Newer
	.pipe(newer(path.build.images))
	//ImgMin
	.pipe(
		imagemin()
	)
	.pipe(
		gulp.dest(path.build.images)
	)
	//WebP
	.pipe(
		webp()
	)
	.pipe(
		gulp.dest(path.build.images)
	)
	//Browser Sync
	.pipe(
		browsersync.stream()
	)
}