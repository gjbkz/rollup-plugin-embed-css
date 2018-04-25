import {
	window,
	Object,
	document,
	addEventListener,
	removeEventListener,
	setTimeout,
	XMLHttpRequest,
} from 'global';

export function getBody(fn) {
	if (document.body) {
		fn(document.body);
	} else {
		setTimeout(() => getBody(fn), 50);
	}
}

export const addEventListenerWithOptions = (function () {
	const eventName = 'test';
	const fn = () => {};
	let supportsPassive = false;
	try {
		addEventListener(eventName, fn, Object.defineProperty({}, 'passive', {
			get() {
				supportsPassive = true;
				return true;
			},
		}));
	} catch (e) {
		supportsPassive = false;
	}
	removeEventListener(eventName, fn);
	return supportsPassive
	? (target, type, handler, options) => target.addEventListener(type, handler, options === true ? {capture: true} : options)
	: (target, type, handler, options) => target.addEventListener(type, handler, options === true || (options && options.capture));
}());

export function toString(x) {
	return Object.prototype.toString.call(x).slice(8, -1);
}

export function forEach(iterable, fn) {
	if (0 <= iterable.length) {
		for (let i = 0; i < iterable.length; i++) {
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
		const keys = Object.keys(iterable);
		while (0 < keys.length) {
			const key = keys.shift();
			fn(iterable[key], key, iterable);
		}
	}
}

export function dom(source) {
	const type = toString(source);
	let node;
	if (type.startsWith('HTML') || type === 'Text' || type === 'DocumentFragment') {
		node = source;
	} else if (type === 'Object') {
		const {
			t = 'div', tag = t,
			a = {}, attrs = a,
			c = [], children = c,
			ae = {}, activeEvents = ae,
			pe = {}, passiveEvents = pe,
		} = source;
		node = document.createElement(tag);
		forEach(children, (child) => {
			node.appendChild(dom(child));
		});
		forEach(activeEvents, (fn, eventName) => {
			addEventListenerWithOptions(node, eventName, fn, {passive: false});
		});
		forEach(passiveEvents, (fn, eventName) => {
			addEventListenerWithOptions(node, eventName, fn, {passive: true});
		});
		forEach(attrs, (value, key) => {
			node.setAttribute(key, value);
		});
		return node;
	} else {
		node = document.createTextNode(source.toString());
	}
	return node;
}

export function jsonp(url, fn) {
	jsonp.id = (jsonp.id || 0) + 1;
	const id = `jsonp_${jsonp.id}`;
	window[id] = fn;
	document.head.appendChild(dom({
		t: 'script',
		a: {src: `${url}?callback=${id}`},
	}));
}

export function markdown(text) {
	const elements = [];
	const regexp = /#(\d+)/g;
	while (true) {
		const {lastIndex} = regexp;
		const result = regexp.exec(text);
		elements.push(dom(text.slice(lastIndex, result ? result.index : undefined)));
		if (!result) {
			break;
		}
		const [matched, issue] = result;
		elements.push(dom({
			t: 'a',
			a: {href: `https://github.com/kei-ito/rollup-plugin-embed-css/issues/${issue}`},
			c: [matched],
		}));
	}
	return elements;
}
