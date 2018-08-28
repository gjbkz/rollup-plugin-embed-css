const fs = require('fs');
const path = require('path');
const {promisify} = require('@nlib/util');
const writeFile = require('@nlib/write-file');
const readFile = promisify(fs.readFile);
exports.loadProjects = () => promisify(fs.readdir)(__dirname)
.then(
	(names) => names
	.filter((name) => name.match(/^\d+/))
	.map((name) => {
		const root = path.join(__dirname, name);
		const getPath = (...args) => {
			const filePath = path.join(...args);
			return path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
		};
		return Object.freeze({
			path: getPath,
			writeFile: (filename, data) => writeFile(getPath('output', filename), data),
			readFile: (...args) => readFile(getPath(...args)),
			name,
			root,
		});
	})
);
