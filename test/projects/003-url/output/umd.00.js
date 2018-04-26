/*
{
	"format": "umd",
	"options": {
		"base": "path-to-project-root/src",
		"dest": "path-to-project-root/output/umd.00.css"
	}
}
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	var classNames = {"foo":"_foo_css_foo"};

	window.classNames = classNames;

})));
