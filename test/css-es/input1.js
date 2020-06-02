import {pure} from './pure';
import './b1.css';
import * as a from './a.css';
export const result = a || pure;
import('./c.css');
