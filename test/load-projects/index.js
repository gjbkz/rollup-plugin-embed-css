const fs = require('fs');
const path = require('path');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir, fs);
const stat = promisify(fs.stat, fs);
module.exports = function loadProjects(directory) {
	return readdir(directory)
	.then((names) => {
		return Promise.all(names.map((name) => stat(path.join(directory, name))))
		.then((results) => {
			return names.filter((name, index) => results[index].isDirectory());
		});
	});
};
