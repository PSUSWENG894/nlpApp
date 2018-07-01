var http = require('http');
var util = require('util');
var fs = require('fs');
var url = require('url');
var nlp = require('compromise');

var PORT = process.env.PORT || 5000;

var server = http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    util.log(url_parts);
    if (url_parts.pathname == '/')
	fs.readFile('./nodeform/nlpform.html', function(error, data) {
		res.end(data);
	});
    else if(url_parts == '/tagInput')
	tagInput(res,url_parts);
    res.writeHead(200, {'Content-Type': 'text/html'});
});

//const server = http.createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('The {"Location": "Philadelphia"} {"Organization": "Flyers"} are the best hockey team in the {"Organization": "NHL"}, and {"Person": "Claude Giroux"} should have won {"Organization": "MVP"}.\n');
//});

server.listen(PORT, () => {
  util.log(`Server running ${PORT}/`);
});

function tagInput(res, url_parts) {
	var inputString = url+parts.query.inputString;
	var tags = "People: \n";
	res.end("Data passed to tagInput -> input: " + inputString);
	var doc = nlp(inputSring);
	tags = tags + doc.people().data();
	tags = tags + "\n Places: \n";
	tags = tags + doc.places().data();
	tags = tags + "\n Organizations: \m";
	tags = tags + doc.organizations().data();
	document.getElementById("outputString").innerHtml(tags);
}
