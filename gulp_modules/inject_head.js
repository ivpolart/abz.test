import inject from 'gulp-inject';

export const inject_head = () => {
	inject.transform.html.js = filepath => `<script src="${filepath}" defer></script>`;

	//Src
	return gulp.src(path.build.injectHtml)

	//Check errors
	.pipe(
		plumber(
			notify.onError({
				title: "Html Inject",
				message: "Error Html Inject: <%= error.message %>"
			})
		)
	)
	//Inject js/css in head
	.pipe(
		inject(gulp.src(path.build.injectCssJs, { read: false }), {
			relative: true,
			name: 'Start',
			endtag: (targetExt, sourceExt) => {return `<!-- End:${sourceExt} -->`}
		})
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
