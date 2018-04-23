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
	[".","_","src","baz","css","{",":",";","}","bar",">","foo","color","red","[","=","false","]","green","@","media"," ","(","max","-","width","400","px",")","blue","800"],
	[[0,1,2,1,3,1,4,1,3,5,3,6,3,7,8],[0,1,2,1,9,1,4,1,9,5,9,6,9,7,8],[0,1,2,1,9,1,4,1,9,10,0,1,2,1,3,1,4,1,3,5,9,6,3,7,8],[0,1,2,1,11,1,4,1,11,5,12,6,13,7,8],[14,11,15,16,17,0,1,2,1,11,1,4,1,11,5,12,6,18,7,8],[19,20,21,22,23,24,25,6,21,26,27,28,5,0,1,2,1,11,1,4,1,11,5,12,6,29,7,8,8],[19,20,21,22,23,24,25,6,21,30,27,28,5,0,1,2,1,9,1,4,1,9,10,0,1,2,1,3,1,4,1,3,5,11,6,3,7,8,0,1,2,1,11,1,4,1,11,24,9,5,11,24,9,6,11,24,9,7,8,8]],
	document.head.appendChild(document.createElement('link'))
));
'use strict';

var baz = {"baz":"_src_baz_css_baz"};

var bar = {"bar":"_src_bar_css_bar"};

var foo = {"foo":"_src_foo_css_foo","foo-bar":"_src_foo_css_foo-bar"};

window.classNames = Object.assign({}, foo, bar, baz);
