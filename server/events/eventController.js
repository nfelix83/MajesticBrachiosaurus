var Event = require('./eventModel.js');

module.exports = {
  newEvent: function(req, res) {
    var event_name = req.body.event_name;
    var location = req.body.location;
    var radius_filter = req.body.radius_filter;

    Event.findOne({event_id: event_id}, function(err, event) { //check to see if event name exists
        //create new event if event doesn't exist
      if(!event) {
        Event.create({
          event_name: event_name,
          location: location,
          radius_filter: radius_filter
        }, function(err, event) {
          if(err) {
            return console.error(err);
          }
          res.json(event);  
        });
      } else {
        res.json(event);
      }
    });
  }
};

