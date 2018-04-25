(function (words, rules, link) {
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', URL.createObjectURL(
		new Blob(
			rules.map(function (rule) {
				return rule.map(function (index) {
					return words[index];
				}).join('');
			}),
			{type: 'text/css'}
		)
	));
	URL.revokeObjectURL(link.getAttribute('href'));
}(
	["*","{","padding",":","0",";","margin"," ","auto","color","inherit","font","text","-","decoration","}","body","400","14","px","apple","system",",","BlinkMacSystemFont","arial","sans","serif","#","333",">","width","94","%","max","700","a","underline",".","_","docs","src","components","header","style","css","container","display","flex","align","items","baseline","justify","content","start","30","border","bottom","1","solid","currentColor","h1","size","36","none","left","4","spacer","grow","main","16","10","24","release","8","radius","3","background","cover","fff","shadow","000","nth","child","(","6n","+",")","image","url","/","static","bg01","jpg","2","bg02","bg03","bg04","5","bg05","bg06","6","18","pre","line","height","white","space"],
	[[0,1,2,3,4,5,6,3,4,7,8,5,9,3,10,5,11,3,10,5,12,13,14,3,10,5,15],[16,1,11,3,17,7,18,19,7,13,20,13,21,22,7,23,22,7,24,22,7,25,13,26,5,9,3,27,28,5,15],[16,29,0,1,30,3,31,32,5,33,13,30,3,34,19,5,15],[35,1,12,13,14,3,36,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,45,1,46,3,47,5,48,13,49,3,50,5,51,13,52,3,47,13,53,5,6,3,54,19,7,8,5,55,13,56,3,57,19,7,58,7,59,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,45,29,0,1,6,3,4,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,45,7,60,1,11,13,61,3,62,19,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,45,7,35,1,12,13,14,3,63,5,9,3,10,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,45,29,35,1,6,13,64,3,65,19,5,15],[37,38,39,38,40,38,41,38,42,38,43,38,44,38,66,1,47,13,67,3,57,5,15],[37,38,39,38,40,38,41,38,68,38,43,38,44,38,45,1,6,3,54,19,7,8,5,15],[37,38,39,38,40,38,41,38,68,38,43,38,44,38,45,29,60,1,6,3,69,19,7,8,7,70,19,7,8,5,11,13,61,3,71,19,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,1,6,3,73,19,7,8,5,2,3,73,19,7,69,19,7,69,19,7,69,19,5,55,13,74,3,75,19,5,76,13,61,3,77,5,9,3,27,78,5,12,13,79,3,4,7,4,7,73,19,7,27,80,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,85,57,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,91,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,85,93,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,94,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,85,75,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,95,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,85,65,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,96,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,85,97,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,98,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,3,81,13,82,83,84,86,1,76,13,87,3,88,83,37,89,90,89,41,89,68,89,72,89,99,37,92,86,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,29,60,1,6,3,70,19,7,8,7,100,19,7,8,5,11,13,61,3,101,19,5,15],[37,38,39,38,40,38,41,38,68,38,72,38,43,38,44,38,45,29,102,1,6,3,4,7,8,5,103,13,104,3,57,37,97,5,105,13,106,3,102,5,15]],
	document.head.appendChild(document.createElement('link'))
));
(function () {
	'use strict';

	var window = self["window"];

	var Object = self["Object"];

	var document = self["document"];

	var addEventListener = self["addEventListener"];

	var removeEventListener = self["removeEventListener"];

	var setTimeout = self["setTimeout"];

	self["XMLHttpRequest"];

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	function getBody(fn) {
		if (document.body) {
			fn(document.body);
		} else {
			setTimeout(function () {
				return getBody(fn);
			}, 50);
		}
	}

	var addEventListenerWithOptions = function () {
		var eventName = 'test';
		var fn = function fn() {};
		var supportsPassive = false;
		try {
			addEventListener(eventName, fn, Object.defineProperty({}, 'passive', {
				get: function get() {
					supportsPassive = true;
					return true;
				}
			}));
		} catch (e) {
			supportsPassive = false;
		}
		removeEventListener(eventName, fn);
		return supportsPassive ? function (target, type, handler, options) {
			return target.addEventListener(type, handler, options === true ? { capture: true } : options);
		} : function (target, type, handler, options) {
			return target.addEventListener(type, handler, options === true || options && options.capture);
		};
	}();

	function toString(x) {
		return Object.prototype.toString.call(x).slice(8, -1);
	}

	function forEach(iterable, fn) {
		if (0 <= iterable.length) {
			for (var i = 0; i < iterable.length; i++) {
				fn(iterable[i], i, iterable);
			}
			// } else if (toString(iterable.next) === 'Function') {
			// 	let count = 0;
			// 	while (true) {
			// 		const {done, value} = iterable.next();
			// 		if (done) {
			// 			break;
			// 		}
			// 		fn(value, count++);
			// 	}
			// } else if (toString(iterable[Symbol.iterator]) === 'Function') {
			// 	forEach(iterable[Symbol.iterator]());
		} else if (toString(iterable) === 'Object') {
			var keys = Object.keys(iterable);
			while (0 < keys.length) {
				var key = keys.shift();
				fn(iterable[key], key, iterable);
			}
		}
	}

	function dom(source) {
		var type = toString(source);
		var node = void 0;
		if (type.startsWith('HTML') || type === 'Text' || type === 'DocumentFragment') {
			node = source;
		} else if (type === 'Object') {
			var _source$t = source.t,
			    t = _source$t === undefined ? 'div' : _source$t,
			    _source$tag = source.tag,
			    tag = _source$tag === undefined ? t : _source$tag,
			    _source$a = source.a,
			    a = _source$a === undefined ? {} : _source$a,
			    _source$attrs = source.attrs,
			    attrs = _source$attrs === undefined ? a : _source$attrs,
			    _source$c = source.c,
			    c = _source$c === undefined ? [] : _source$c,
			    _source$children = source.children,
			    children = _source$children === undefined ? c : _source$children,
			    _source$ae = source.ae,
			    ae = _source$ae === undefined ? {} : _source$ae,
			    _source$activeEvents = source.activeEvents,
			    activeEvents = _source$activeEvents === undefined ? ae : _source$activeEvents,
			    _source$pe = source.pe,
			    pe = _source$pe === undefined ? {} : _source$pe,
			    _source$passiveEvents = source.passiveEvents,
			    passiveEvents = _source$passiveEvents === undefined ? pe : _source$passiveEvents;

			node = document.createElement(tag);
			forEach(children, function (child) {
				node.appendChild(dom(child));
			});
			forEach(activeEvents, function (fn, eventName) {
				addEventListenerWithOptions(node, eventName, fn, { passive: false });
			});
			forEach(passiveEvents, function (fn, eventName) {
				addEventListenerWithOptions(node, eventName, fn, { passive: true });
			});
			forEach(attrs, function (value, key) {
				node.setAttribute(key, value);
			});
			return node;
		} else {
			node = document.createTextNode(source.toString());
		}
		return node;
	}

	function jsonp(url, fn) {
		jsonp.id = (jsonp.id || 0) + 1;
		var id = 'jsonp_' + jsonp.id;
		window[id] = fn;
		document.head.appendChild(dom({
			t: 'script',
			a: { src: url + '?callback=' + id }
		}));
	}

	function markdown(text) {
		var elements = [];
		var regexp = /#(\d+)/g;
		while (true) {
			var lastIndex = regexp.lastIndex;

			var result = regexp.exec(text);
			elements.push(dom(text.slice(lastIndex, result ? result.index : undefined)));
			if (!result) {
				break;
			}

			var _result = _slicedToArray(result, 2),
			    matched = _result[0],
			    issue = _result[1];

			elements.push(dom({
				t: 'a',
				a: { href: 'https://github.com/kei-ito/rollup-plugin-embed-css/issues/' + issue },
				c: [matched]
			}));
		}
		return elements;
	}

	var style = { "container": "_docs_src_components_header_style_css_container", "spacer": "_docs_src_components_header_style_css_spacer" };

	function header() {
		return dom({
			t: 'header',
			a: { class: style.container },
			c: [{
				t: 'h1',
				c: [{
					t: 'a',
					a: { href: 'https://github.com/kei-ito/rollup-plugin-embed-css' },
					c: ['rollup-plugin-embed-css']
				}]
			}, { a: { class: style.spacer } }, {
				t: 'a',
				a: { href: 'https://www.npmjs.com/package/rollup-plugin-embed-css' },
				c: [{
					t: 'img',
					a: { src: 'https://img.shields.io/npm/v/rollup-plugin-embed-css.svg' }
				}]
			}, {
				t: 'a',
				a: { href: 'https://github.com/kei-ito/rollup-plugin-embed-css/issues' },
				c: [{
					t: 'img',
					a: { src: 'https://img.shields.io/github/issues/kei-ito/rollup-plugin-embed-css.svg' }
				}]
			}]
		});
	}

	var style$1 = { "container": "_docs_src_components_main_release_style_css_container" };

	function release(data) {
		return dom({
			t: 'section',
			a: { class: style$1.container },
			c: [{
				t: 'h1',
				c: [{
					t: 'a',
					a: { href: data.html_url },
					c: [data.tag_name]
				}]
			}, {
				t: 'pre',
				c: markdown(data.body)
			}]
		});
	}

	var style$2 = { "container": "_docs_src_components_main_style_css_container" };

	function main() {
		var main = dom({
			t: 'main',
			a: { class: style$2.container },
			c: [{
				t: 'h1',
				c: ['Releases']
			}]
		});
		jsonp('https://api.github.com/repos/kei-ito/rollup-plugin-embed-css/releases', function (_ref) {
			var data = _ref.data;

			if (data.message) {
				main.appendChild(dom({
					t: 'a',
					a: { href: data.documentation_url },
					c: [data.message]
				}));
			} else {
				forEach(data, function (releaseData) {
					return main.appendChild(release(releaseData));
				});
			}
		});
		return main;
	}

	getBody(function (body) {
		body.appendChild(header());
		body.appendChild(main());
	});

}());
