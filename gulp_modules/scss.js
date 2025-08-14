import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';
import cssnano from 'cssnano';

const sass = gulpSass(dartSass);

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

export const scss = () => {
	//Src
	return gulp.src(path.src.scss)

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "SCSS",
				message: "Error SCSS: <%= error.message %>"
			})
		)
	)
	// Sourcemaps Init
	.pipe(
		gulpif(app.isDev,
			sourcemaps.init()
		)
	)
	//SCSS ==> CSS
	.pipe(
		sass({
			silenceDeprecations: ['legacy-js-api'],
			outputStyle: 'expanded'
		})
	)
	//isBuild
	//Postcss
	.pipe(
		gulpif(app.isBuild,
			tap((file) => {
				file.startTime = performance.now()
			})
		)
	)
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			postcss([
				autoprefixer(),
				sortMediaQueries(),
				cssnano()
			])
		)
	)
	.pipe(
		gulpif(app.isBuild && app.unMinify,
			postcss([
				autoprefixer(),
				sortMediaQueries()
			])
		)
	)
	.pipe(
		gulpif(app.isBuild,
			tap((file) => {
				finishedText('CSS Magic', file)
			})
		)
	)
	.pipe(
		gulpif(app.isBuild && !app.unMinify,
			rename({ suffix: '.min' })
		)
	)
	//Sourcemaps Write
	.pipe(
		gulpif(app.isDev,
			sourcemaps.write('.')
		)
	)
	//Dest
	.pipe(
		gulp.dest(path.build.css)
	)
	//Browser Sync
	.pipe(
		browsersync.stream()
	)
}