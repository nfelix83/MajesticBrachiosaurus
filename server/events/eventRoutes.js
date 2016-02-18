var eventController = require('./eventController');
var app = require('../server.js');

app.post('/create', eventController.newEvent);
