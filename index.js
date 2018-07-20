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
  console.log("Example app listening at %s:%s", host, port)
});
 
 
app.get('/', function (req, res) {
  var html=printHtmlForm('', 'LIST', null);
  res.send(html);
});
 
app.post('/tagged', urlencodedParser, function (req, res){
  var input = req.body.inputString;
  var outputFormat = req.body.outputFormat;
  var selections = req.body.selections;
  console.log(req.body);
  var reply=printHtmlForm(input, outputFormat, selections);
  reply += "<br/><b>The tagged input is shown below:</b><br/>";
  var tags = tagInput(input, outputFormat, selections);
  reply += tags;
  res.send(reply);
 });

 function tagInput(data, format, selections) {
	if (format === 'LIST') {
		return tagList(data, selections);
	} else if (format === 'JSON') {
		return tagJson(data, selections);
	} else if (format === 'XML') {
		return tagXml(data, selections);
	} else {
		return "Error, unknown output format."
	}
 }

function tagList(data, selections) {
        var inputString = data;
        var tags = "<textarea rows='10' cols='80' readonly='true'>People: &#13;&#10;";
        var doc = nlp(inputString);
	console.log(doc.dates().out);
	console.log(doc.phoneNumbers().out);
	console.log(doc.values()).out;
//	console.log(doc.money());
	tags = tags + doc.people().out();
        tags = tags + "&#13;&#10;&#13;&#10;Places: &#13;&#10;";
        tags = tags + doc.places().out();
        tags = tags + "&#13;&#10;&#13;&#10;Organizations: &#13;&#10;";
        tags = tags + doc.organizations().out();
	tags = tags + "</textarea>";
	return tags;
}

function tagJson(data, selections) {
        var inputString = data;
	var outputData = "<textarea rows='10' cols='80' readonly='true'>" + data;
        var doc = nlp(inputString);
	var peeps = doc.people().data();
	for (var i=0; i<peeps.length; i++) {
		var peep = peeps[i];
		outputData = outputData.replace(peep.text, "{Person: " + peep.text + "}");
	}
	var locs = doc.places().data();
	for (var i=0; i<locs.length; i++) {
		var loc = locs[i];
		outputData = outputData.replace(loc.text, "{Place: " + loc.text + "}");
	}
	var orgs = doc.organizations().data();
	for (var i=0; i<orgs.length; i++) {
		var org = orgs[i];
		outputData = outputData.replace(org.text, "{Organization: " + org.text + "}");
	}
	outputData = outputData + "</textarea>";
	return outputData;
}

function tagXml(data, selections) {
        var inputString = data;
	var outputData = "<textarea rows='10' cols='80' readonly='true'>" + data;
        var doc = nlp(inputString);
	var peeps = doc.people().data();
	for (var i=0; i<peeps.length; i++) {
		var peep = peeps[i];
		outputData = outputData.replace(peep.text, "<Person>" + peep.text + "</Person>");
	}
	var locs = doc.places().data();
	for (var i=0; i<locs.length; i++) {
		var loc = locs[i];
		outputData = outputData.replace(loc.text, "<Place>" + loc.text + "</Place>");
	}
	var orgs = doc.organizations().data();
	for (var i=0; i<orgs.length; i++) {
		var org = orgs[i];
		outputData = outputData.replace(org.text, "<Organization>" + org.text + "</Organization>");
	}
	outputData = outputData + "</code>";
	return outputData;
}

 function printHtmlForm(data, format, selections) {
  var html='';
  html +="<body>";
  html += "<h1>Welcome to the PSU SWENG 894 Group 3 Natural Language Processing App</h1>";
  html += "<form method='post' action='/tagged' name='tagForm'>";
  html += "<b><label>Please fill in the text area below to have the NLP tag it.</label></b><br/>";
  html += "<textarea name='inputString' id='inputString' rows='10' cols='80' placeholder='Enter text for NLP here'>";
  if (data && data !== '' && data !== 'undefined') {
	  html += data;
  }
  html += "</textarea><br/>";
  html += "<label><b>Select from the output formats below</b></label><br/>";
  html += "<input type='radio' name='outputFormat' value='XML'";
  if (format && format ==='XML') {
	  html += " checked";
  }
  html += "> XML<br/>";
  html += "<input type='radio' name='outputFormat' value='LIST'";
  if (format && format ==='LIST') {
	  html += " checked";
  }
  html += "> List<br/>";
  html += "<input type='radio' name='outputFormat' value='JSON'";
  if (format && format ==='JSON') {
	  html += " checked";
  }
  html += "> JSON<br/>";
  html += "<b><label>Select the checkboxes below for the categories you want tagged</label></b><br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Person<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Place<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Organization<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Date<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Money<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Percent<br/>";
  html += "<input type='checkbox' name='selections' value='Person'> Phone Number<br/>";
  html += "<input type='submit' name='tagButton' id='tagButton' value='Tag'><br/>";
  html += "<input type='reset' name='resetButton' id='resetButton' value='Reset'><br/>";
  html += "</form>";
  html += "</body>";
  return html;
 }
