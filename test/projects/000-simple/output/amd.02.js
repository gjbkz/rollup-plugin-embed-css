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
	["/","*"," ","comment","1",".","_","0","{","color",":","red",";","}","2","green"],
	[[0,1,2,3,2,4,2,1,0],[5,6,7,8,9,10,11,12,13],[0,1,2,3,2,14,2,1,0],[5,6,4,8,9,10,15,12,13]],
	document.head.appendChild(document.createElement('link'))
));
define(function () { 'use strict';

	var classNames = {"foo":"_0","bar-baz":"_1"};

	window.classNames = classNames;

});
