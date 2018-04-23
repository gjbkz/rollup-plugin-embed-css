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
	[".","_","footer","style","css","container","{","background",":","blue",";","}","header","logo","width","100","px","red",">","200"],
	[[0,1,2,1,3,1,4,1,5,6,7,8,9,10,11],[0,1,12,1,13,1,4,1,13,6,14,8,15,16,10,11],[0,1,12,1,3,1,4,1,5,6,7,8,17,10,11],[0,1,12,1,3,1,4,1,5,18,0,1,12,1,13,1,4,1,13,6,14,8,19,16,10,11]],
	document.head.appendChild(document.createElement('link'))
));
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
