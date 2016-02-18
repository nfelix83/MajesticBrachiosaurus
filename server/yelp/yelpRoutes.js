var app = require('../server.js');
var yelpSearch = require('./yelpController.js');

app.get('/search', yelpSearch);