// plugins
import gulp        from 'gulp'
import plumber     from 'gulp-plumber'
import notify      from 'gulp-notify'
import browsersync from 'browser-sync'
import newer       from 'gulp-newer'
import gulpif      from 'gulp-if'
import tap         from 'gulp-tap'
import chalk       from 'chalk'
import rename      from 'gulp-rename'
import ghPages from 'gulp-gh-pages';

// import path
import { path } from './gulp_modules/_path.js'

//global variables
global.gulp = gulp;
global.path = path;
global.browsersync = browsersync;
global.color = chalk;
global.plumber = plumber;
global.notify = notify;
global.gulpif = gulpif;
global.tap = tap;
global.newer = newer;
global.rename = rename;

global.app = {
	isBuild:  process.argv.includes('build'),
	isDev:    process.argv.includes('dev'),
	unMinify: process.argv.includes('--unMinify')
}

//tasks
import { scss }        from './gulp_modules/scss.js';
import { html }        from './gulp_modules/html.js';
import { js }          from './gulp_modules/js.js';
import { copy_jq }     from './gulp_modules/js.js';
import { inject_head } from './gulp_modules/inject_head.js';
import { images }      from './gulp_modules/images.js';
import { copy }        from './gulp_modules/copy.js';
import { server }      from './gulp_modules/server.js';
import { clean }       from './gulp_modules/clean.js';


// function watcher
function watcher () {
	const watchPath = {
		html:       path.src.htmlWatch,
		scss:       path.src.scss,
		js:         path.src.js,
		injectHead: path.src.html,
		images:     path.src.images,
		copy:       path.src.copy
	}
	gulp.watch(watchPath.html, gulp.series(html, inject_head));
	gulp.watch(watchPath.scss, scss);
	gulp.watch(watchPath.js, js);
	gulp.watch(watchPath.js, copy_jq);
	gulp.watch(watchPath.images, images);
	gulp.watch(watchPath.copy, copy);
}

const mainTasks = gulp.series(clean, copy, scss, html, js, copy_jq, images, inject_head)

const dev = gulp.series(mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(mainTasks);

// deploy to GitHub Pages
function deploy() {
	return gulp.src('./dist/**/*')
	.pipe(ghPages());
}

export { deploy };

//export scenarious
export { dev }
export { build }

export const publish = gulp.series(build, deploy);

//default task
gulp.task('default', mainTasks)



///?????
/*export const test = () => {
	console.log(app.isOne)
};*/