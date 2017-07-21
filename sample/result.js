var style = {
	"container": "_1"
};

function header() {
	const element = document.createElement('header');
	element.classList.add(style.container);
	return element;
}

var style$1 = {
	"container": "_2"
};

function footer() {
	const element = document.createElement('footer');
	element.classList.add(style$1.container);
	return element;
}

document.body.appendChild(header());
document.body.appendChild(footer());
(function (words, rules) {
	var sheet = document.head.appendChild(document.createElement('style')).sheet;
	function decode(indexes) {
		return indexes.map(function (index) {
			return words[index];
		}).join('');
	}
	for (var i = rules.length; i--;) {
		sheet.insertRule(decode(rules[i]), 0);
	}
}(
	[".","_0","{","width",":","100","px",";","}","_1","background","red",">","200","_2","blue"],
	[[0,1,2,3,4,5,6,7,8],[0,9,2,10,4,11,7,8],[0,9,12,0,1,2,3,4,13,6,7,8],[0,14,2,10,4,15,7,8]]
));
