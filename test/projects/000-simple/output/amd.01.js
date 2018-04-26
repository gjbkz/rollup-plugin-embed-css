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

	var classNames = {"foo":"_src_foo_css_foo","bar-baz":"_src_foo_css_bar-baz"};

	window.classNames = classNames;

});
