/*
{
	"format": "cjs",
	"options": {
		"mangle": true,
		"dest": "path-to-project-root/output/cjs.02.css"
	}
}
*/
'use strict';

var baz = {"baz":"_0"};

var bar = {"bar":"_1"};

var foo = {"foo":"_2","foo-bar":"_3"};

window.classNames = Object.assign({}, foo, bar, baz);
