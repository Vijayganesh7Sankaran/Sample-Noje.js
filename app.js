var express = require("express");
var bodyParser = require('body-parser');
var fs = require("fs");
var cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function (req, res, next) {
	console.log(req.method + " " + req.url);
	next();
});

app.use(express.static('./public/'));

app.post('/postlogs', function (req, res) {
	console.log(req.body.user);
	//console.log(req.body.description);
	fs.readFile('./public/store.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var jsondat = JSON.parse(data);
			jsondat.user.push(req.body.user);
			console.log(jsondat);

			fs.writeFile('./public/store.json', JSON.stringify(jsondat), function (error) {
				if (error) {
					console.log(err);
				} else {
					console.log("Write successful");
					res.send("Write Successful");
				}
			});
		}
	});
});

app.get('/getlogs', function (req, res) {
	console.log(req.query.ip);
	var reqip = req.query.ip;

	fs.readFile('./public/store.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var jsondat = JSON.parse(data);
			var stack = [];
			var payload = {
				"user": []
			};
			var i = 0;
			for (i = 0; i < jsondat.user.length; i++) {
				if (jsondat.user[i].ip === reqip) {
					payload.user.push(jsondat.user[i]);
				}
			}
			console.log(JSON.stringify(payload));
			res.send(payload);
		}
	});
});

app.listen(3000);

console.log("Server started...listening on port:3000");