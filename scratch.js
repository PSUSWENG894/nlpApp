var nlp = require('./src/index');
// nlp.verbose('tagger');

let doc = nlp('The competent drum work of Don Brewer?').debug();
doc.terms().data();
doc.out('text');
