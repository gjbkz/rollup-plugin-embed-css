/*
{
	"format": "umd",
	"options": {
		"mangle": true
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
