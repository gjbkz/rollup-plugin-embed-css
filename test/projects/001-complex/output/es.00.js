/*
{
	"format": "es",
	"options": {
		"base": "path-to-project-root/src",
		"dest": "path-to-project-root/output/css-output/es.00.css"
	}
}
*/
var baz = {"baz":"_baz_css_baz"};

var bar = {"bar":"_bar_css_bar"};

var foo = {"foo":"_foo_css_foo","foo-bar":"_foo_css_foo-bar"};

window.classNames = Object.assign({}, foo, bar, baz);
