var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Event = require('./events/eventModel.js');


var port = process.env.PORT || 8000;
//connect to heroku mongolab
var uri = 'mongodb://testing:testing@ds013918.mongolab.com:13918/heroku_p92qhfjt' || 'mongodb://localhost/brachiosaurus';
mongoose.connect(uri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../../client'));

app.enable('trust proxy');


io.on('connection', function(socket){
	//emit sends message out
	console.log('a user connected');
	socket.on('send:message', function (data) {
    Event.findOne({event_id: data.event_id}, function(err, event) {
      if(err) {
        return console.error('Error finding same event id for chatroom',err);
      }
      //if event id is found, save new username/message into db
      if(event) {
        event.messages.username = data.name;
        event.messages.message = data.message;
      }

      event.save(function(err) {
        if(err) {
          return console.error('Error in saving new chat messages', err);
        }
      });
    });
      socket.broadcast.emit('send:message', {
        //user: name,
        text: data.message
    });
  });
		//event_name
		//username
	
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