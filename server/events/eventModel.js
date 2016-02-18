var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  term: String,
  location: String
});

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;