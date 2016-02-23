var randomWords = require('random-words');
var Event = require('./eventModel.js');

module.exports = {
  newEvent: function(req, res) {
    console.log('req', req.body);
    var event_name = req.body.event_name;
    var location = req.body.location;
    var radius = req.body.radius;
    var event_id = randomWords({exactly: 2}).join(""); //generate two random word to make it as event_id
    var usersArray = [];
    usersArray.push({
      ip: req.ip.split('.').join('-'),
      votesCast: 0,
      choicesMade: 0
    });

    Event.findOne({event_id: event_id}, function(err, event) { //check to see if event id exists
      if(err) {
        return console.error('err', err);
      }      
      //create new event if event doesn't exist
      if(!event) {
        Event.create({
          event_id: event_id,
          event_name: event_name,
          location: location,
          radius: radius,
          users: usersArray
        }, function(err, event) {
          if(err) {
            return console.error(err);
          }
          res.json(event);  //send newly created event object to client
        });
      } else { //if randomly generated event_id already exist within db on create event call
          return newEvent(req, res); //re-run function to get new event_id; 
      }
    });
  },
  getEvent: function(req, res) {
    //when user connects with events_id url that's created
    var event_id = req.params.event_id;
    //return data with same event_id
    Event.findOne({event_id: event_id}, function(err, event) {
      if(err) {
        return console.error('err', err);
      }
      if(event) {
        var formattedIP = req.ip.split('.').join('-');
        var existingUser = false;
        for (var i = 0; i < event.users.length; i++) {
          if (event.users[i].ip === formattedIP) {
            existingUser = true;
            break;
          }
        }
        if (existingUser === false) {
          event.users.push({
            ip: formattedIP,
            votesCast: 0,
            choicesMade: 0
          });
        }
        console.log('get event id', event.event_id);
        res.redirect('/#/' + event.event_id);
      }
      else {
        res.redirect('/');
      }
      
    });
  },
  sendEvent: function(req, res) {
    console.log(req.body);
    var event_id = req.params.event_id;
    console.log(req.params);
    Event.findOne({event_id: event_id}, function(err, event) {
      if(err) {
        return console.error('err', err);
      }
      if(event) {
        var formattedIP = req.ip.split('.').join('-');
        var existingUser = false;
        for (var i = 0; i < event.users.length; i++) {
          if (event.users[i].ip === formattedIP) {
            existingUser = true;
            break;
          }
        }
        if (existingUser === false) {
          event.users.push({
            ip: formattedIP,
            votesCast: 0,
            choicesMade: 0
          });
        }
        console.log('send event data', event);
        res.json(event);
      }
    });
    
  }
};