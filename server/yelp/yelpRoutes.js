var app = require('../server.js');
var yelp = require('./yelpController.js');

app.get('/:event_id/search', yelp.Search);
app.post('/:event_id/store', yelp.storeBusiness);
app.get('/:event_id/saved', yelp.getBusinesses);