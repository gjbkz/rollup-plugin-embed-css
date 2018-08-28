/*
{
	"format": "cjs",
	"options": {
		"base": "path-to-project-root"
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
	[".","_","src","bar","baz","css","{","background",":","url","(","/","png",")",";","}","foo"],
	[[0,1,2,1,3,1,4,1,5,1,4,6,7,8,9,10,0,11,4,0,12,13,14,15],[0,1,2,1,16,1,5,1,16,6,7,8,9,10,0,11,16,0,12,13,14,15]],
	document.head.appendChild(document.createElement('link'))
));
'use strict';

var classNames = {"foo":"_src_foo_css_foo"};

window.classNames = classNames;
