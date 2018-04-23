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
	[".","_","0","{","background",":","blue",";","}","1","width","100","px","2","red",">","200"],
	[[0,1,2,3,4,5,6,7,8],[0,1,9,3,10,5,11,12,7,8],[0,1,13,3,4,5,14,7,8],[0,1,13,15,0,1,9,3,10,5,16,12,7,8]],
	document.head.appendChild(document.createElement('link'))
));
var style = {"container":"_2"};

function header() {
	const element = document.createElement('header');
	element.classList.add(style.container);
	return element;
}

var style$1 = {"container":"_0"};

function footer() {
	const element = document.createElement('footer');
	element.classList.add(style$1.container);
	return element;
}

document.body.appendChild(header());
document.body.appendChild(footer());
