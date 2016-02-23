var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  event_id: String,
  event_name: String,
  location: String,
  radius: Number,
  choices: {
    businesses: Array
  }
  
});

module.exports = mongoose.model('Event', EventSchema);