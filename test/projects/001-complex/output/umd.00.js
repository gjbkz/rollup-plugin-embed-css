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

	var baz = {"baz":"_baz_css_baz"};

	var bar = {"bar":"_bar_css_bar"};

	var foo = {"foo":"_foo_css_foo","foo-bar":"_foo_css_foo-bar"};

	window.classNames = Object.assign({}, foo, bar, baz);

})));
