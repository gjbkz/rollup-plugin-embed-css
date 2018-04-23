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
	[".","_","0","{","baz",":",";","}","1","bar",">","2","color","red","[","foo","=","false","]","green","@","media"," ","(","max","-","width","400","px",")","blue","800","3"],
	[[0,1,2,3,4,5,4,6,7],[0,1,8,3,9,5,9,6,7],[0,1,8,10,0,1,2,3,9,5,4,6,7],[0,1,11,3,12,5,13,6,7],[14,15,16,17,18,0,1,11,3,12,5,19,6,7],[20,21,22,23,24,25,26,5,22,27,28,29,3,0,1,11,3,12,5,30,6,7,7],[20,21,22,23,24,25,26,5,22,31,28,29,3,0,1,8,10,0,1,2,3,15,5,4,6,7,0,1,32,3,15,25,9,5,15,25,9,6,7,7]],
	document.head.appendChild(document.createElement('link'))
));
(function () {
	'use strict';

	var baz = {"baz":"_0"};

	var bar = {"bar":"_1"};

	var foo = {"foo":"_2","foo-bar":"_3"};

	window.classNames = Object.assign({}, foo, bar, baz);

}());
