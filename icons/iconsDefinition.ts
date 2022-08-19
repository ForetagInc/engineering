import * as fs from 'fs';
import { paths } from './paths';

/**
 * Remove the extension from a file name (eg. "file.svg")
 * @param fileName {string} Filename string
 */
const removeFileExtension = (fileName: string) => {
	return fileName.replace(/\.[^/.]+$/, '');
};

/**
 * Get all the svg icons from the svgs
 * source path and remove the file extension
 */
const iconsList = fs.readdirSync(paths.svgs).map(icon => {
	if (icon.match(/\.svg$/i))
		return removeFileExtension(icon)
});

/**
 * Define the Icon object constructor
 * to build the icon object schema
 * required by the theme
 * @param path {String} is the filename path
 */
class Icon {
	constructor(path: string) {
		const iconName = '_file_' + path;
		// @ts-ignore
		this[iconName] = {
			iconPath: `./svgs/${path}.svg`
		};
	}
}

/**
 * For each files found in `iconsList`
 * call the Icon contructor and generate the
 * full json theme
 */
const icons = iconsList.reduce(
	// @ts-ignore
	(acc, icon: string) => {
		const iconFromSvg = new Icon(icon);
		acc.iconDefinitions = {
			...acc.iconDefinitions,
			...iconFromSvg
		};
		return acc;
	},
	{ iconDefinitions: {} }
);

export default icons;
