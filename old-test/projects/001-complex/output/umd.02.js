/*
{
	"format": "umd",
	"options": {
		"mangle": true,
		"dest": "path-to-project-root/output/css-output/umd.02.css"
	}
}
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	var baz = {"baz":"_0"};

	var bar = {"bar":"_1"};

	var foo = {"foo":"_2","foo-bar":"_3"};

	window.classNames = Object.assign({}, foo, bar, baz);

})));
