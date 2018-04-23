/*
{
	"format": "iife",
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
	["/","*"," ","comment","1",".","_","src","foo","css","{","color",":","red",";","}","2","bar","-","baz","green"],
	[[0,1,2,3,2,4,2,1,0],[5,6,7,6,8,6,9,6,8,10,11,12,13,14,15],[0,1,2,3,2,16,2,1,0],[5,6,7,6,8,6,9,6,17,18,19,10,11,12,20,14,15]],
	document.head.appendChild(document.createElement('link'))
));
(function () {
	'use strict';

	var classNames = {"foo":"_src_foo_css_foo","bar-baz":"_src_foo_css_bar-baz"};

	window.classNames = classNames;

}());
