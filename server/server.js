var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);


var port = process.env.PORT || 8000;
//connected to heroku
var uri = 'mongodb://testing:testing@ds013918.mongolab.com:13918/heroku_p92qhfjt' || 'mongodb://localhost/brachiosaurus';
mongoose.connect(uri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../../client'));

app.enable('trust proxy');


io.on('connection', function(socket){
	//emit sends message out
	console.log('a user connected');
});


app.get('/', function(req, res) {
  res.send(200, '/');
});

http.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;

var eventRoute = require('./events/eventRoutes.js');
var yelpRoutes = require('./yelp/yelpRoutes.js');