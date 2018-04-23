/*
{
	"format": "cjs",
	"option": {
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
	[".","_","baz","css","{",":",";","}","bar",">","foo","color","red","[","=","false","]","green","@","media"," ","(","max","-","width","400","px",")","blue","800"],
	[[0,1,2,1,3,1,2,4,2,5,2,6,7],[0,1,8,1,3,1,8,4,8,5,8,6,7],[0,1,8,1,3,1,8,9,0,1,2,1,3,1,2,4,8,5,2,6,7],[0,1,10,1,3,1,10,4,11,5,12,6,7],[13,10,14,15,16,0,1,10,1,3,1,10,4,11,5,17,6,7],[18,19,20,21,22,23,24,5,20,25,26,27,4,0,1,10,1,3,1,10,4,11,5,28,6,7,7],[18,19,20,21,22,23,24,5,20,29,26,27,4,0,1,8,1,3,1,8,9,0,1,2,1,3,1,2,4,10,5,2,6,7,0,1,10,1,3,1,10,23,8,4,10,23,8,5,10,23,8,6,7,7]],
	document.head.appendChild(document.createElement('link'))
));
'use strict';

var baz = {"baz":"_baz_css_baz"};

var bar = {"bar":"_bar_css_bar"};

var foo = {"foo":"_foo_css_foo","foo-bar":"_foo_css_foo-bar"};

window.classNames = Object.assign({}, foo, bar, baz);
