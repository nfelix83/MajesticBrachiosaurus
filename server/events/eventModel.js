var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  event_id: String,
  event_name: String,
  location: String,
  date: String,
  time: String,
  radius: {
    type: Number,
    default: 1
  },
  choices: {
    businesses: [{
      business_id: String,
      votes: {
        type: Number,
        default: 0
      },
      ips: Array
    }]
  },
  users: [{
    ip: String,
    choicesMade: Number,
    votesCast: Number
  }]
});

module.exports = mongoose.model('Event', EventSchema);