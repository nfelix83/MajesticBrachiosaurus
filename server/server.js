var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8000;

mongoose.connect('mongodb://testing:testing@ds013918.mongolab.com:13918/heroku_p92qhfjt' || 'mongodb://localhost/brachiosaurus');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../../client'));

app.get('/', function(req, res) {
  res.send(200, '/');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;

var eventRoute = require('./events/eventRoutes.js');
var yelpRoutes = require('./yelp/yelpRoutes.js');