import {jsonp, dom, forEach} from '//util/index.js';
import {release} from './release/index.js';
import style from './style.css';

export function main() {
	const main = dom({
		t: 'main',
		a: {class: style.container},
		c: [
			{
				t: 'h1',
				c: ['Releases'],
			},
		],
	});
	jsonp('https://api.github.com/repos/kei-ito/rollup-plugin-embed-css/releases', ({data}) => {
		if (data.message) {
			main.appendChild(dom({
				t: 'a',
				a: {href: data.documentation_url},
				c: [data.message],
			}));
		} else {
			forEach(data, (releaseData) => main.appendChild(release(releaseData)));
		}
	});
	return main;
}
