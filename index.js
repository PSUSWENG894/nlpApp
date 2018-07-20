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
  var html=printHtmlForm('', 'LIST', ['Person', 'Place', 'Organization', 'DateTime', 'PhoneNumber']);
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
	var newline = "&#13;&#10;";
	var tab = "&#9;";
        var tags = "<textarea rows='10' cols='80' readonly='true'>";
        var doc = nlp(inputString);
	if (selections.indexOf('Person') > -1) {
		tags = tags + "People: " + newline;
		for (var i=0; i<doc.people().data().length; i++) {
			tags = tags + tab + doc.people().data()[i].text + newline;
		}
		tags = tags + newline + newline;
	}
	if (selections.indexOf('Place') > -1) {
        	tags = tags + "Places: " + newline;
		for (var i=0; i<doc.places().data().length; i++) {
			tags = tags + tab + doc.places().data()[i].text + newline;
		}
		tags = tags + newline + newline;
	}
	if (selections.indexOf('Organization') > -1) {
        	tags = tags + "Organizations: " + newline;
		for (var i=0; i<doc.organizations().data().length; i++) {
			tags = tags + tab + doc.organizations().data()[i].text + newline;
		}
		tags = tags + newline + newline;
	}
	if (selections.indexOf('DateTime') > -1) {
		tags = tags + "Date/Time: " + newline;
		for (var i=0; i<doc.dates().data().length; i++) {
			tags = tags + tab + doc.dates().data()[i].text + newline;
		}
		tags = tags + newline + newline;
	}
	if (selections.indexOf('PhoneNumber') > -1) {
		tags = tags + "Phone Numbers: " + newline;
		for (var i=0; i<doc.phoneNumbers().data().length; i++) {
			tags = tags + tab + doc.dates().data()[i].text + newline;
		}
		tags = tags + newline + newline;
	}
	tags = tags + "</textarea>";
	return tags;
}

function tagJson(data, selections) {
        var inputString = data;
	var outputData = "<textarea rows='10' cols='80' readonly='true'>" + data;
        var doc = nlp(inputString);
	if (selections.indexOf('Person') > -1) {
		var peeps = doc.people().data();
		for (var i=0; i<peeps.length; i++) {
			var peep = peeps[i];
			outputData = outputData.replace(peep.text, "{Person: " + peep.text + "}");
		}
	}
	if (selections.indexOf('Place') > -1) {
		var locs = doc.places().data();
		for (var i=0; i<locs.length; i++) {
			var loc = locs[i];
			outputData = outputData.replace(loc.text, "{Place: " + loc.text + "}");
		}
	}
	if (selections.indexOf('Organization') > -1) {
		var orgs = doc.organizations().data();
		for (var i=0; i<orgs.length; i++) {
			var org = orgs[i];
			outputData = outputData.replace(org.text, "{Organization: " + org.text + "}");
		}
	}
	if (selections.indexOf('DateTime') > -1) {
		var dates = doc.dates().data();
		for (var i=0; i<dates.length; i++) {
			var dateTime = dates[i];
			outputData = outputData.replace(dateTime.text, "{DateTime: " + dateTime.text + "}");
		}
	}
	if (selections.indexOf('PhoneNumber') > -1) {
		var numbers = doc.phoneNumbers().data();
		for (var i=0; i<numbers.length; i++) {
			var number = numbers[i];
			outputData = outputData.replace(number.text, "{PhoneNumber: " + number.text + "}");
		}
	}
	outputData = outputData + "</textarea>";
	return outputData;
}

function tagXml(data, selections) {
        var inputString = data;
	var outputData = "<textarea rows='10' cols='80' readonly='true'>" + data;
        var doc = nlp(inputString);
	if (selections.indexOf('Person') > -1) {
		var peeps = doc.people().data();
		for (var i=0; i<peeps.length; i++) {
			var peep = peeps[i];
			outputData = outputData.replace(peep.text, "<Person>" + peep.text + "</Person>");
		}
	}
	if (selections.indexOf('Place') > -1) {
		var locs = doc.places().data();
		for (var i=0; i<locs.length; i++) {
			var loc = locs[i];
			outputData = outputData.replace(loc.text, "<Place>" + loc.text + "</Place>");
		}
	}
	if (selections.indexOf('Organization') > -1) {
		var orgs = doc.organizations().data();
		for (var i=0; i<orgs.length; i++) {
			var org = orgs[i];
			outputData = outputData.replace(org.text, "<Organization>" + org.text + "</Organization>");
		}
	}
	if (selections.indexOf('DateTime') > -1) {
		var dates = doc.dates().data();
		for (var i=0; i<dates.length; i++) {
			var dateTime = dates[i];
			outputData = outputData.replace(dateTime.text, "<DateTime>" + dateTime.text + "</DateTime>");
		}
	}
	if (selections.indexOf('PhoneNumber') > -1) {
		var numbers = doc.phoneNumbers().data();
		for (var i=0; i<numbers.length; i++) {
			var number = numbers[i];
			outputData = outputData.replace(number.text, "<PhoneNumber> " + number.text + "</PhoneNumber>");
		}
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
  html += "<input type='checkbox' name='selections' value='Person'";
  if (selections.indexOf('Person') > -1) {
	  html += " checked";
  }
  html += "> Person<br/>";
  html += "<input type='checkbox' name='selections' value='Place'";
  if (selections.indexOf('Place') > -1) {
	  html += " checked";
  }
  html += "> Place<br/>";
  html += "<input type='checkbox' name='selections' value='Organization'";
  if (selections.indexOf('Organization') > -1) {
	  html += " checked";
  }
  html += "> Organization<br/>";
  html += "<input type='checkbox' name='selections' value='DateTime'";
  if (selections.indexOf('DateTime') > -1) {
	  html += " checked";
  }
  html += "> Date/Time<br/>";
  html += "<input type='checkbox' name='selections' value='PhoneNumber'";
  if (selections.indexOf('PhoneNumber') > -1) {
	  html += " checked";
  }
  html += "> Phone Number<br/>";
  html += "<input type='submit' name='tagButton' id='tagButton' value='Tag'><br/>";
  html += "<input type='reset' name='resetButton' id='resetButton' value='Reset'><br/>";
  html += "</form>";
  html += "</body>";
  return html;
 }
