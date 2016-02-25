var randomWords = require('random-words');
var Event = require('./eventModel.js');

module.exports = {
  newEvent: function(req, res) {
    var event_name = req.body.event_name;
    var location = req.body.location;
    var radius = req.body.radius;
    var date = req.body.date;
    var time = req.body.time;
    var event_id = randomWords({exactly: 2}).join(""); //generate two random word to make it as event_id
    var usersArray = [];
    usersArray.push({
      ip: req.ip.split('.').join('-'),
      votesCast: 0,
      choicesMade: []
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
          date: date,
          time: time,
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
            choicesMade: []
          });
          event.save();
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
    var event_id = req.params.event_id;
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
            choicesMade: []
          });
          event.save();
        }
        res.json(event);
      }
    });
    
  },
  updateVotes: function(req, res) {
    var event_id = req.params.event_id;
    var index = req.body.index;
    var ip = req.ip.split('.').join('-');
    var business_id = req.body.id;
    Event.findOne({event_id: event_id}, function(err, event) {
      // var listOfIps = event.choices.businesses[index].ips;
      if(err) {
        return console.error(err);
      }

      if(event) {
        event.choices.businesses.forEach(function(business) {
          if(business.business_id === business_id) {
            business.votes = business.votes + 1;
            if(business.ips.indexOf(ip) !== - 1) {
              res.status(301).end();
            }
            else {
              business.ips.push(ip);
              event.save(function(err) {
                if(err) {
                  return console.error(err);
                }
                console.log('event', event.choices.businesses);
                res.json({event: event, business: business});
              });
            }
          }
        }); 
      }
    });
  }

};