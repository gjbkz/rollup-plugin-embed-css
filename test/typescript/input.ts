declare var g: any;
import {foo} from './foo';
import {classes, properties} from './style.css';
const repeat = (x: string) => x + x;
g.results = {foo, bar: repeat(properties.color), classes, properties};
