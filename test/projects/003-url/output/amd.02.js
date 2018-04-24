/*
{
	"format": "amd",
	"options": {
		"mangle": true
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
	[".","_","0","{","background",":","url","(","/","baz","png",")",";","}","1","foo"],
	[[0,1,2,3,4,5,6,7,0,8,9,0,10,11,12,13],[0,1,14,3,4,5,6,7,0,8,15,0,10,11,12,13]],
	document.head.appendChild(document.createElement('link'))
));
define(function () { 'use strict';

	var classNames = {"foo":"_1"};

	window.classNames = classNames;

});
