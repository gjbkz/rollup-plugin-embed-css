# rollup-plugin-embed-css

[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-embed-css.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-embed-css)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9b26fe15174b4c8a86f96bbdc0b00db2)](https://www.codacy.com/app/kei.itof/rollup-plugin-embed-css?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kei-ito/rollup-plugin-embed-css&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9b26fe15174b4c8a86f96bbdc0b00db2)](https://www.codacy.com/app/kei.itof/rollup-plugin-embed-css?utm_source=github.com&utm_medium=referral&utm_content=kei-ito/rollup-plugin-embed-css&utm_campaign=Badge_Coverage)
[![dependencies Status](https://david-dm.org/kei-ito/rollup-plugin-embed-css/status.svg)](https://david-dm.org/kei-ito/rollup-plugin-embed-css)
[![devDependencies Status](https://david-dm.org/kei-ito/rollup-plugin-embed-css/dev-status.svg)](https://david-dm.org/kei-ito/rollup-plugin-embed-css?type=dev)

A plugin to embed css into JavaScript codes using [postcss](https://github.com/postcss/postcss).

1. This plugin imports a .css file as an object which maps class names to minified class names. Class names are minified uniquely and it makes styles modular.
2. This plugin appends scripts which loads imported styles into the page. You don't have to load external .css files.
3. This plugin supports `@import` syntax. The plugin detects them and append imported files to dependencies.

## Installation

```bash
npm install --save-dev rollup-plugin-embed-css
```

## Usage

Suppose that you have following files.

- [index.js](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/index.js)
- [header/index.js](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/header/index.js)
- [header/style.css](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/header/style.css)
- [header/logo.css](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/header/logo.css)
- [footer/index.js](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/footer/index.js)
- [footer/style.css](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/footer/style.css)

You can see the files in [the sample directory](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample).

Next, [rollup](https://github.com/rollup/rollup) the `index.js`.

```javascript
const fs = require('fs');
const {rollup} = require('rollup');
const embedCSS = require('rollup-plugin-embed-css');

Promise.resolve()
.then(async () => {
	const bundle = await rollup({
		entry: 'index.js',
		plugins: [embedCSS({
			postcss: [] // optional
		})]
	});
	const {code} = await bundle.generate({format: 'es'});
	fs.writeFileSync('result.js', code);
})
.catch((error) => {
	console.error(error);
	process.exit(1);
});
```

Then, you'll get [result.js](https://github.com/kei-ito/rollup-plugin-embed-css/tree/master/sample/result.js)
.

```javascript
// result.js
var style = {
	"container": "_1"
};

function header() {
	const element = document.createElement('header');
	element.classList.add(style.container);
	return element;
}

var style$1 = {
	"container": "_2"
};

function footer() {
	const element = document.createElement('footer');
	element.classList.add(style$1.container);
	return element;
}

document.body.appendChild(header());
document.body.appendChild(footer());
(function (words, rules) {
	var sheet = document.head.appendChild(document.createElement('style')).sheet;
	function decode(indexes) {
		return indexes.map(function (index) {
			return words[index];
		}).join('');
	}
	for (var i = rules.length; i--;) {
		sheet.insertRule(decode(rules[i]), 0);
	}
}(
	[".","_0","{","width",":","100","px",";","}","_1","background","red",">","200","_2","blue"],
	[[0,1,2,3,4,5,6,7,8],[0,9,2,10,4,11,7,8],[0,9,12,0,1,2,3,4,13,6,7,8],[0,14,2,10,4,15,7,8]]
));
```

## `@import` Syntax

You can use `@import` syntax when the style declarations requires class names in external files (e.g. `.a>.b`).

```css
/* a.css */
.classA {...}
```

```css
/* b.css */
.classB {...}
```

```css
@import './a.css';
@import './b.css';
.sample>$1.classA {...}
.sample>$2.classB {...}
```

Imports are named automatically as $1, $2, ...
You can also name the imports.

```css
@import './a.css' modA;
@import './b.css' modB;
.sample>modA.classA {...}
.sample>modB.classB {...}
```

## Options

- `postcss`: An array which passed to [postcss](https://github.com/postcss/postcss).

## LICENSE

MIT
