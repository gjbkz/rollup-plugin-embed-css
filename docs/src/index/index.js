import {header, main} from '//components/index.js';
import {getBody} from '//util/index.js';
getBody((body) => {
	body.appendChild(header());
	body.appendChild(main());
});
