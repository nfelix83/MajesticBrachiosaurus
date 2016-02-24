var app = require('../server.js');
var yelp = require('./yelpController.js');

app.get('/:event_id/search', yelp.search);
app.post('/:event_id/store', yelp.storeBusiness);
app.post('/:event_id/remove', yelp.removeBusiness);
app.get('/:event_id/saved', yelp.getBusinesses);