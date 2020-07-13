# rollup-plugin-embed-css

![Test](https://github.com/kei-ito/rollup-plugin-embed-css/workflows/Test/badge.svg)
[![codecov](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/rollup-plugin-embed-css)

This plugin wraps [esifycss](https://github.com/kei-ito/esifycss).

## Installation

```bash
npm install --save-dev rollup-plugin-embed-css
```

## Usage

```javascript
import embedCSS from 'rollup-plugin-embed-css';
export default {
  input: '...',
  plugins: [
    embedCSS({/* Options */}),
  ],
  output: {
    format: '...',
    file: '...',
  },
};
```

## Options

You can pass all [esifycss options](https://github.com/kei-ito/esifycss#options) except the `include` option.

## LICENSE

The rollup-plugin-embed-css project is licensed under the terms of the Apache 2.0 License.
