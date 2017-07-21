import style from './style.css';
function footer() {
	const element = document.createElement('footer');
	element.classList.add(style.container);
	return element;
}
export default footer;
