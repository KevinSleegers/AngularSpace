/*var express = require('express');
var app 	= express();
var server	= require('http').Server(app);
var io 		= require('socket.io')(server);
var path 	= require('path');

var port = process.env.PORT || 8000;
server.listen(port, function() {
	console.log("Running on port: ", port);
});

var staticPath = path.join(__dirname);
app.use(express.static(staticPath));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var port = process.env.PORT || 8000;
http.listen(port, function() {
	console.log('Running on port: ', port);
})

var staticPath = path.join(__dirname);
app.use(express.static(staticPath));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

require('./routes/io.js')(app, io);