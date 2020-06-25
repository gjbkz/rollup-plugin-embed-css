import {set} from './set';
import * as style4 from './style4.css';

const style = getComputedStyle(document.documentElement);

set(
    {
        'style1': style.getPropertyValue('--style1'),
        'style2': style.getPropertyValue('--style2'),
        'style3': style.getPropertyValue('--style3'),
        'style4': style.getPropertyValue('--style4'),
    },
    style4,
);

document.title = 'Done';
