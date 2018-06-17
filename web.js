var nlp = require('./src/index');
// nlp.verbose('tagger');

let doc = nlp('The competent drum work of Don Brewer?').debug();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the text you would like to have tagged: ', (answer) => {
  // TODO: Log the answer in a database
  let textInput = nlp(${answer});
  textInput.terms().data();
  textInput.out('text');
  nlp(${answer}).debug();

  rl.close();
});


function outputTerms(input) {
	let doc = nlp(input);
	doc.terms().data();
	return doc.out('text');
};
