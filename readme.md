# rollup-plugin-embed-css

> **Development has moved to the [esifycss monorepo](https://github.com/gjbkz/esifycss).**
>
> This package is now maintained in [`packages/rollup-plugin-embed-css`](https://github.com/gjbkz/esifycss/tree/main/packages/rollup-plugin-embed-css).
> The npm package name remains `rollup-plugin-embed-css`. Use the [current documentation](https://github.com/gjbkz/esifycss/tree/main/packages/rollup-plugin-embed-css#readme), and report issues or submit pull requests in [gjbkz/esifycss](https://github.com/gjbkz/esifycss).
>
> The maintained 2.x release line requires **Node.js 22 or newer** and **Rollup 4**.
> The documentation below describes the legacy standalone release.

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
