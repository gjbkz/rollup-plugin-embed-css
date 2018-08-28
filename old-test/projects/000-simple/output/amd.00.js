/*
{
	"format": "amd",
	"options": {
		"base": "path-to-project-root/src",
		"dest": "path-to-project-root/output/css-output/amd.00.css"
	}
}
*/
define(function () { 'use strict';

	var classNames = {"foo":"_foo_css_foo","bar-baz":"_foo_css_bar-baz"};

	window.classNames = classNames;

});
