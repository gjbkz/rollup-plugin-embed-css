import {ServerSet} from './servers';

export interface ITestInput {
    input: Array<string> | string,
    servers: ServerSet,
}

export interface ITestResult {
    className: {
        [key: string]: string,
    },
    id: {
        [key: string]: string,
    },
    keyframes: {
        [key: string]: string,
    },
    style1: string,
    style2: string,
    style3: string,
    style4: string,
}
