const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

const rootSrcPath = path.resolve(__dirname + '/../src/');
const rootDistPath = path.resolve(__dirname + '/../dist/');
const pageFiles = glob.sync(path.resolve(__dirname + '/../src/**/*.html'), {
	ignore: ['**/parts/**'],
});

const partFiles = glob.sync(
	path.resolve(__dirname + '/../src/parts/**/*.html')
);

partFiles.forEach(file => {
	const fileName = path
		.resolve(file)
		.replace('.html', '')
		.replace(rootSrcPath, '')
		.split(path.sep)
		.filter(i => !!i)
		.join(path.sep)
		.replace('parts' + path.sep, '');

	Handlebars.registerPartial(
		fileName,
		fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
	);
});

fs.emptyDirSync(rootDistPath, {
	recursive: true, 
});

fs.copySync(rootSrcPath + '/js', rootDistPath + '/js');
fs.copySync(rootSrcPath + '/css', rootDistPath + '/css');

let builtPages = [];

pageFiles.forEach(file => {
	const fileName = path.resolve(file).replace('.html', '');
	const distFile = path.resolve(file).replace(rootSrcPath, rootDistPath);
	const distFolder = distFile.split(path.sep).slice(0, -1).join(path.sep);

	builtPages.push(file);

	const template = Handlebars.compile(
		fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
	);

	fs.mkdirSync(distFile.split(path.sep).slice(0, -1).join(path.sep), {
		recursive: true,
	});
	fs.writeFileSync(distFile, template({}));
});

console.log(`Built ${builtPages.length} pages`);
