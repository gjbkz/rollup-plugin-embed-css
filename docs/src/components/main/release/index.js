import {dom, markdown} from '//util/index.js';
import style from './style.css';

export function release(data) {
	return dom({
		t: 'section',
		a: {class: style.container},
		c: [
			{
				t: 'h1',
				c: [
					{
						t: 'a',
						a: {href: data.html_url},
						c: [data.tag_name],
					},
				],
			},
			{
				t: 'pre',
				c: markdown(data.body),
			},
		],
	});
}
