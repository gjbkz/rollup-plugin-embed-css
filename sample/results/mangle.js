var style = {"container":"_1"};

function header() {
	const element = document.createElement('header');
	element.classList.add(style.container);
	return element;
}

var style$1 = {"container":"_2"};

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
	[".","_","0","{","width",":","100","px",";","}","1","background","red",">","200","2","blue"],
	[[0,1,2,3,4,5,6,7,8,9],[0,1,10,3,11,5,12,8,9],[0,1,10,13,0,1,2,3,4,5,14,7,8,9],[0,1,15,3,11,5,16,8,9]],
	document.head.appendChild(document.createElement('style')).sheet
));
