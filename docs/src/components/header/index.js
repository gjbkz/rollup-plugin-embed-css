import {dom} from '//util/index.js';
import style from './style.css';
export function header() {
	return dom({
		t: 'header',
		a: {class: style.container},
		c: [
			{
				t: 'h1',
				c: [
					{
						t: 'a',
						a: {href: 'https://github.com/kei-ito/rollup-plugin-embed-css'},
						c: ['rollup-plugin-embed-css'],
					},
				],
			},
			{a: {class: style.spacer}},
			{
				t: 'a',
				a: {href: 'https://www.npmjs.com/package/rollup-plugin-embed-css'},
				c: [
					{
						t: 'img',
						a: {src: 'https://img.shields.io/npm/v/rollup-plugin-embed-css.svg'},
					},
				],
			},
			{
				t: 'a',
				a: {href: 'https://github.com/kei-ito/rollup-plugin-embed-css/issues'},
				c: [
					{
						t: 'img',
						a: {src: 'https://img.shields.io/github/issues/kei-ito/rollup-plugin-embed-css.svg'},
					},
				],
			},
		],
	});
}
