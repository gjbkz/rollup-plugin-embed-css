/*
{
	"format": "iife",
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
	["/","*"," ","comment","1",".","_","foo","css","{","color",":","red",";","}","2","bar","-","baz","green"],
	[[0,1,2,3,2,4,2,1,0],[5,6,7,6,8,6,7,9,10,11,12,13,14],[0,1,2,3,2,15,2,1,0],[5,6,7,6,8,6,16,17,18,9,10,11,19,13,14]],
	document.head.appendChild(document.createElement('link'))
));
(function () {
	'use strict';

	var classNames = {"foo":"_foo_css_foo","bar-baz":"_foo_css_bar-baz"};

	window.classNames = classNames;

}());
