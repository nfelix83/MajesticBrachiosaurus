var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var eventController = require('./events/eventController.js');


var port = process.env.PORT || 8000;
//connect to heroku mongolab
var uri = 'mongodb://testing:testing@ds013918.mongolab.com:13918/heroku_p92qhfjt' || 'mongodb://localhost/brachiosaurus';
mongoose.connect(uri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../../client'));

app.enable('trust proxy');


io.on('connection', function (socket) {
  console.log('a user connected');
  
  // get existing messages from db
  // var messages = eventController.getMessages();
  // send exisiting messages on new connection
  // socket.emit('init', {
  //   messages: messages
  // });
  socket.on('send:message', function (data) {
    // store message in db
    // eventController.postMessage(data);
    // broadcast a user's message to other users
    socket.broadcast.emit('send:message', {
      user: data.name,
      text: data.message

    });
  });
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
