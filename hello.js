var http = require('http');
var util = require('util');i
var fs = require('fs');
var url = require('url');

var server = http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    util.log(url_parts);
    if (url_parts.pathname == '/')
	fs.readfile('./nodeforms/nlpform.html', function(error, data) {
		res.end(data);
	});
    else if(url_parts == '/tagInput')
	tagInput(res,url_parts);
    res.writeHead(200, {'Content-Type': 'text/plain'});
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
	res,end("Data passed to tagInput -> input: " + url_parts.query.inputString);
}
