/*
{
	"format": "iife",
	"options": {
		"base": "path-to-project-root",
		"dest": "path-to-project-root/output/iife.01.css"
	}
}
*/
(function () {
	'use strict';

	var classNames = {"foo":"_src_foo_css_foo","bar-baz":"_src_foo_css_bar-baz"};

	window.classNames = classNames;

}());
