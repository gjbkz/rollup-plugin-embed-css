const {runInNewContext} = require('vm');
const console = require('console');

exports.runCode = (code, sandbox = {}) => {
    sandbox = {console, ...sandbox};
    sandbox.global = sandbox;
    runInNewContext(code, sandbox);
    return sandbox;
};
