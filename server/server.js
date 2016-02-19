var express = require('express');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 8000;
module.exports = app;

var eventRoute = require('./events/eventRoutes.js');

var yelpRoutes = require('./yelp/yelpRoutes.js');

mongoose.connect('mongodb://localhost/brachiosaurus');

app.use(express.static(__dirname + '/../../client'));

app.get('/', function(req, res) {
  res.end('hello world');
});


app.listen(port, function() {
  console.log('Listening on port ' + port);
});