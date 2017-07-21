import style from './style.css';
function header() {
	const element = document.createElement('header');
	element.classList.add(style.container);
	return element;
}
export default header;
