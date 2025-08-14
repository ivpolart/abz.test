export const server = (done) => {
	browsersync.init({
		server: {
			baseDir: `${path.build.html}`
		},
		port: 3000,
		open: "external"
	});
}