/*
{
	"format": "amd",
	"options": {
		"base": "path-to-project-root/src"
	}
}
*/
(function (words, rules, link) {
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', URL.createObjectURL(
		new Blob(
			rules.map(function (rule) {
				return rule.map(function (index) {
					return words[index];
				}).join('');
			}),
			{type: 'text/css'}
		)
	));
	URL.revokeObjectURL(link.getAttribute('href'));
}(
	[".","_","bar","baz","css","{","background",":","url","(","/","png",")",";","}","foo"],
	[[0,1,2,1,3,1,4,1,3,5,6,7,8,9,0,10,2,10,3,0,11,12,13,14],[0,1,15,1,4,1,15,5,6,7,8,9,0,10,15,0,11,12,13,14]],
	document.head.appendChild(document.createElement('link'))
));
define(function () { 'use strict';

	var classNames = {"foo":"_foo_css_foo"};

	window.classNames = classNames;

});
