var randomWords = require('random-words');
var Event = require('./eventModel.js');

module.exports = {
  newEvent: function(req, res) {
    var event_name = req.body.event_name;
    var location = req.body.location;
    var event_id = randomWords({exactly: 2}).join("");

    Event.findOne({event_id: event_id}, function(err, event) { //check to see if event id exists
      if(err) {
        return console.error(err);
      }      
      //create new event if event doesn't exist
      if(!event) {
        Event.create({
          event_id: event_id,
          event_name: event_name,
          location: location
        }, function(err, event) {
          if(err) {
            return console.error(err);
          }
          res.json(event);  //send newly created event object to client
        });
      } else { //if event id already exist, send client that event object
        res.json(event);
      }
    });
  }
};

