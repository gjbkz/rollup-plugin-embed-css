# rollup-plugin-embed-css

[![Greenkeeper badge](https://badges.greenkeeper.io/kei-ito/rollup-plugin-embed-css.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-embed-css.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-embed-css)
[![Build status](https://ci.appveyor.com/api/projects/status/github/kei-ito/rollup-plugin-embed-css?branch=master&svg=true)](https://ci.appveyor.com/project/kei-ito/rollup-plugin-embed-css/branch/master)
[![codecov](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css)

A plugin to embed css into JavaScript codes using [postcss](https://github.com/postcss/postcss).

1. This plugin imports a .css file as an object which maps class names to minified class names. Class names are minified uniquely and it makes styles modular. This means you don't have to concern about naming somethings. For example, you can use `.container` for every components in a project.
2. This plugin appends a script that loads imported styles into the page using objectURL. You don't have to load external .css files.
3. This plugin detects `@import` syntax and append imported files to dependencies. It works well with [`rollup.watch`](https://rollupjs.org/#rollup-watch).
4. You can replace `url(...)` with the `options.url` option.

## Installation

```bash
npm install --save-dev rollup-plugin-embed-css
```

## Usage

```javascript
const embedCSS = require('rollup-plugin-embed-css');
module.exports = {
  input: '...',
  plugins: [
    embedCSS()
  ],
  output: {
    format: '...',
    file: '...',
  },
};
```

## How it works

TBW.

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

- `plugins`: An array which passed to [postcss](http://api.postcss.org/postcss.html).
- `processOptions`: An object which passed to [postcss.parse](http://api.postcss.org/postcss.html#.parse) or [processor.process](http://api.postcss.org/Processor.html#process).
- `mangle`: Boolean. See the mangler section below.
- `base`: String. See the mangler section below.
- `mangler`: Function(String *id*, String *className*) → String. See the mangler section below. If it is set, the `mangle` and `base` options are ignored.
- `dest`: String. If it exists, the CSS code is written to options.dest. Otherwise, the CSS code is embedded into script.

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
