/*
{
	"format": "umd",
	"option": {
		"base": "path-to-project-root/src"
	}
}
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	var classNames = {};

	window.classNames = classNames;

})));
