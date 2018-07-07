var http = require("http");
var express = require('express');
var nlp = require('compromise');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var PORT = process.env.PORT || 5000;

// Running Server Details.
var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});
 
 
app.get('/', function (req, res) {
  var html='';
  html +="<body>";
  html += "<form method='post' action='/tagged' name='tagForm'>";
  html += "<label>Please fill in the text area below to have the NLP tag it.</label><br/>";
  html += "<textarea name='inputString' id='inputString' rows='8' cols='80' placeholder='Enter text for NLP here'></textarea><br/>";
  html += "<label>Select from the output formats below</label><br/>";
  html += "<input type='radio' name='outputFormat' value='XML'> XML<br/>";
  html += "<input type='radio' name='outputFormat' value='LIST' checked> List<br/>";
  html += "<input type='radio' name='outputFormat' value='JSON'> JSON<br/>";
  html += "<input type='submit' name='tagButton' id='tagButton' value='Tag'><br/>";
  html += "<input type='reset' name='resetButton' id='resetButton' value='Reset'><br/>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});
 
app.post('/tagged', urlencodedParser, function (req, res){
  var reply='';
  var input = req.body.inputString;
  console.log(input);
  var outputFormat = req.body.outputFormat;
  console.log(outputFormat);
  var tags = tagInput(input);
  reply += tags;
  res.send(reply);
 });

 function tagInput(data) {
        var inputString = data;
        var tags = "People: \n";
        console.log("Data passed to tagInput -> input: " + inputString);
        var doc = nlp(inputString);
        tags = tags + doc.people().data();
        tags = tags + "\n Places: \n";
        tags = tags + doc.places().data();
        tags = tags + "\n Organizations: \n";
        tags = tags + doc.organizations().data();
	return tags;
 }
