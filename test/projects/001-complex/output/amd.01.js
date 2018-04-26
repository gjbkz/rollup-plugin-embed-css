/*
{
	"format": "amd",
	"options": {
		"base": "path-to-project-root",
		"dest": "path-to-project-root/output/amd.01.css"
	}
}
*/
define(function () { 'use strict';

	var baz = {"baz":"_src_baz_css_baz"};

	var bar = {"bar":"_src_bar_css_bar"};

	var foo = {"foo":"_src_foo_css_foo","foo-bar":"_src_foo_css_foo-bar"};

	window.classNames = Object.assign({}, foo, bar, baz);

});
