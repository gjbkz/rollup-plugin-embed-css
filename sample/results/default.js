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
