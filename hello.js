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

server.listen(443);
util.log('Server listening on port 443');

function tagInput(res, url_parts) {
	res,end("Data passed to tagInput -> input: " + url_parts.query.inputString);
}
