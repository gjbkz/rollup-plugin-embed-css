# rollup-plugin-embed-css

[![Greenkeeper badge](https://badges.greenkeeper.io/kei-ito/rollup-plugin-embed-css.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-embed-css.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-embed-css)
[![Build status](https://ci.appveyor.com/api/projects/status/github/kei-ito/rollup-plugin-embed-css?branch=master&svg=true)](https://ci.appveyor.com/project/kei-ito/rollup-plugin-embed-css/branch/master)
[![codecov](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css)
[![dependencies Status](https://david-dm.org/kei-ito/rollup-plugin-embed-css/status.svg)](https://david-dm.org/kei-ito/rollup-plugin-embed-css)
[![devDependencies Status](https://david-dm.org/kei-ito/rollup-plugin-embed-css/dev-status.svg)](https://david-dm.org/kei-ito/rollup-plugin-embed-css?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkei-ito%2Frollup-plugin-embed-css.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkei-ito%2Frollup-plugin-embed-css?ref=badge_shield)

A plugin to embed css into JavaScript codes using [postcss](https://github.com/postcss/postcss).

1. This plugin imports a .css file as an object which maps class names to minified class names. Class names are minified uniquely and it makes styles modular. This means you don't have to concern about naming somethings. For example, you can use `.container` for every components in a project.
2. This plugin appends a script which loads imported styles into the page using [CSSStyleSheet.insertRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule). You don't have to load external .css files.
3. This plugin detects `@import` syntax and append imported files to dependencies. It works well with [`rollup.watch`](https://rollupjs.org/#rollup-watch).

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
    input: 'index.js',
    plugins: [
      embedCSS()
    ],
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
var style = {"container":"_header_style_css_container"};

function header() {
  const element = document.createElement('header');
  element.classList.add(style.container);
  return element;
}

var style$1 = {"container":"_footer_style_css_container"};

function footer() {
  const element = document.createElement('footer');
  element.classList.add(style$1.container);
  return element;
}

document.body.appendChild(header());
document.body.appendChild(footer());

(function (words, rules, sheet, i) {
  for (i = rules.length; i--;) {
    insert(decode(rules[i]));
  }
  function decode(indexes) {
    return indexes.map(function (index) {
      return words[index];
    }).join('');
  }
  function insert(decoded) {
    try {
      sheet.insertRule(decoded, 0);
    } catch (error) {
      console.info(error, decoded);
    }
  }
}(
  [".","_","header","logo","css","{","width",":","100","px",";","}","style","container","background","red",">","200","footer","blue"],
  [[0,1,2,1,3,1,4,1,3,5,6,7,8,9,10,11],[0,1,2,1,12,1,4,1,13,5,14,7,15,10,11],[0,1,2,1,12,1,4,1,13,16,0,1,2,1,3,1,4,1,3,5,6,7,17,9,10,11],[0,1,18,1,12,1,4,1,13,5,14,7,19,10,11]],
  document.head.appendChild(document.createElement('style')).sheet
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
- `mangle`: Boolean. See the mangler section below.
- `base`: String. See the mangler section below.
- `mangler`: Function. See the mangler section below. If it is set, the `mangle` and `base` options are ignored.

### `mangler` option

`mangler` is a function generates a class name from (id, className).
`base` and `mangle` options are shorthand for built-in `mangler` functions.
They works as the code below.

```javascript
if (!options.mangler) {
  if (options.mangle) {
    const labeler = options.labeler || new embedCSS.Labeler();
    options.mangler = (id, className) => `_${labeler.label(`${id}/${className}`)}`;
    // ('/home/foo/bar.css', 'a') → _0
    // ('/home/foo/bar.css', 'b') → _1
    // ('/home/foo/baz.css', 'a') → _2
  } else {
    options.base = options.base || process.cwd();
    options.mangler = (id, className) => [
      path.relative(options.base, id).replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
      className,
    ].join('_');
    // Assume base is /home
    // ('/home/foo/bar.css', 'a') → _foo_bar_css_a
    // ('/home/foo/bar.css', 'b') → _foo_bar_css_b
    // ('/home/foo/baz.css', 'a') → _foo_baz_css_a
  }
}
```

## LICENSE

MIT
