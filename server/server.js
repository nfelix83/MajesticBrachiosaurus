var express = require('express');
var mongoose = require('mongoose');


var app = express();
var port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;