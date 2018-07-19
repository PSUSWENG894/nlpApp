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
  var html=printHtmlForm();
  res.send(html);
});
 
app.post('/tagged', urlencodedParser, function (req, res){
  var reply=printHtmlForm('');
  reply += "<br/><b>The tagged input is shown below:</b><br/>";
  var input = req.body.inputString;
  console.log(input);
  var outputFormat = req.body.outputFormat;
  console.log(outputFormat);
  var tags = tagInput(input, outputFormat);
  reply += tags;
  res.send(reply);
 });

 function tagInput(data, format) {
	if (format === 'LIST') {
		return tagList(data);
	} else if (format === 'JSON') {
		return tagJson(data);
	} else if (format === 'XML') {
		return tagXml(data);
	} else {
		return "Error, unknown output format."
	}
 }

function tagList(data) {
        var inputString = data;
        console.log("Data passed to tagList -> input: " + inputString);
        var tags = "People: <br/>";
        var doc = nlp(inputString);
        tags = tags + doc.people().out();
        tags = tags + "<br/>Places: </br/>";
        tags = tags + doc.places().out();
        tags = tags + "<br/>Organizations: <br/>";
        tags = tags + doc.organizations().out();
	return tags;
}

function tagJson(data) {
        var inputString = data;
	var outputData = "<pre>" + data;
        console.log("Data passed to tagJson -> input: " + inputString);
        var doc = nlp(inputString);
	var peeps = doc.people().data();
	console.log(peeps);
	var peep;
	for (peep in peeps) {
		console.log(peep.text);
		outputData = outputData.replace(peep.text, "{Person: " + peep.text + "}");
	}
	var locs = doc.places().data();
	var loc;
	for (loc in locs) {
		console.log(loc.text);
		outputData = outputData.replace(loc.text, "{Place: " + loc.text + "}");
	}
	var orgs = doc.organizations().data();
	var org;
	for (org in orgs) {
		console.log(org.text);
		outputData = outputData.replace(org.text, "{Organization: " + org.text + "}");
	}
	outputData = outputData + "</pre>";
	return outputData;
}

function tagXml(data) {
        var inputString = data;
	var outputData = "<pre>" + data;
        console.log("Data passed to tagXML -> input: " + inputString);
        var doc = nlp(inputString);
	var peeps = doc.people().data();
	console.log(peeps);
	var peep;
	for (peep in peeps) {
		console.log(peep.text);
		outputData = outputData.replace(peep.text, "<Person>" + peep.text + "</Person>");
	}
	var locs = doc.places().data();
	var loc;
	for (loc in locs) {
		console.log(loc.text);
		outputData = outputData.replace(loc.text, "<Place>" + loc.text + "</Place>");
	}
	var orgs = doc.organizations().data();
	var org;
	for (org in orgs) {
		console.log(org.text);
		outputData = outputData.replace(org.text, "<Organization>" + org.text + "</KOrganization>");
	}
	outputData = outputData + "</pre>";
	return outputData;
}

 function printHtmlForm(data) {
  var html='';
  html +="<body>";
  html += "<form method='post' action='/tagged' name='tagForm'>";
  html += "<label>Please fill in the text area below to have the NLP tag it.</label><br/>";
  html += "<textarea name='inputString' id='inputString' rows='8' cols='80' placeholder='Enter text for NLP here'>";
  if (data !== '') {
	  html += data;
  }
  html += "</textarea><br/>";
  html += "<label>Select from the output formats below</label><br/>";
  html += "<input type='radio' name='outputFormat' value='XML'> XML<br/>";
  html += "<input type='radio' name='outputFormat' value='LIST' checked> List<br/>";
  html += "<input type='radio' name='outputFormat' value='JSON'> JSON<br/>";
  html += "<input type='submit' name='tagButton' id='tagButton' value='Tag'><br/>";
  html += "<input type='reset' name='resetButton' id='resetButton' value='Reset'><br/>";
  html += "</form>";
  html += "</body>";
  return html;
 }
