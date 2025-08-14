// src/dist || markup
const buildFolder = process.argv.includes('--one') ? './' : './dist';
const srcFolder = process.argv.includes('--one') ? './' : './src';

export const path = {
	build: {
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		images: `${buildFolder}/images/`,
		injectCssJs: [
			`${buildFolder}/**/*.js`,
			`!${buildFolder}/**/*jquery*.js`,
			`${buildFolder}/css/**/*.css`
		],
		injectHtml: `${buildFolder}/**/*.html`
	},
	src: {
		html: [
				`${srcFolder}/**/*.html`,
				`!${srcFolder}/**/_*.html`
		],
		htmlWatch: `${srcFolder}/**/*.html`,
		scss: `${srcFolder}/scss/**/*.{scss,css}`,
		js: [
				`${srcFolder}/js/**/*.*`,
				`!${srcFolder}/js/**/_*.js`,
				`!${srcFolder}/js/*jquery*.js`
		],
		jQuerry: `${srcFolder}/js/*jquery*.js`,
		images: `${srcFolder}/images/**/*.{png,jpg,jpeg,tiff,webp,svg,gif}`,
		copy: [
				`${srcFolder}/**/*.*`,
				`!${srcFolder}/*.*`,
				`!${srcFolder}/js/**/*.*`,
				`!${srcFolder}/images/**/*.*`,
				`!${srcFolder}/components/**/*.*`,
				`!${srcFolder}/scss/**/*.*`
		]
	},
	buildFolder: buildFolder
}