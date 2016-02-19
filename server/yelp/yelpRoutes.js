var app = require('../server.js');
var yelpSearch = require('./yelpController.js');

app.get('/:event_id/search', yelpSearch);
app.post('/:event_id/store', storeBusiness);
app.get('/:event_id/saved', getBusinesses);