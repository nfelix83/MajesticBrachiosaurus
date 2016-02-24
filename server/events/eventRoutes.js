var eventController = require('./eventController');
var app = require('../server.js');


app.post('/create', eventController.newEvent);

app.get('/:event_id', eventController.getEvent);
app.post('/:event_id/details', eventController.sendEvent);
app.post('/:event_id/votes', eventController.updateVotes);