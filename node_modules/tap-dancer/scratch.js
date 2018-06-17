const exec = require('child_process').execSync;
const path = "~/nlp/nlp-compromise/tests/unit/**/*.test.js"

var tape = 'node_modules/.bin/tape';
var tapDance = './bin/cmd.js';
// var tapDance = '"node_modules/.bin/tap-dance"';

//the quotations here are strangely-important
let cmd = `"${tape}" "${path}" | "${tapDance}"`
console.log(cmd)
exec(cmd);
