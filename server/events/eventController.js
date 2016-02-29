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
        return console.error('Error finding event id', err);
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
          return this.newEvent(req, res); //re-run function to get new event_id;
      }
    });
  },
  getEvent: function(req, res) {
    //when user connects with events_id url that's created
    var event_id = req.params.event_id;
    //return data with same event_id
    Event.findOne({event_id: event_id}, function(err, event) {
      if(err) {
        return console.error('Error redirecting to event page', err);
      }
      if(event) {
        //if event id is found
        var formattedIP = req.ip.split('.').join('-');
        var existingUser = false;
        //check to see if that user ip already exist in db
        for (var i = 0; i < event.users.length; i++) {
          if (event.users[i].ip === formattedIP) {
            existingUser = true;
            break;
          }
        }
        //if user ip doesn't exist in db, create new user with ip and other data and store in db
        if (existingUser === false) {
          event.users.push({
            ip: formattedIP,
            votesCast: 0,
            choicesMade: []
          });
          event.save();
        }
        //redirect to angular route of event id
        res.redirect('/#/' + event.event_id);
      }
      //if the url with event id doesnt exist, reroute to home page to create
      else {
        res.redirect('/');
      }

    });
  },
  sendEvent: function(req, res) {
    var event_id = req.params.event_id;
    Event.findOne({event_id: event_id}, function(err, event) {
      if(err) {
        return console.error('Error sending event data', err);
      }
      //if event id is found in db
      if(event) {
        var formattedIP = req.ip.split('.').join('-');
        var existingUser = false;
        //check to see if user ip already exist in db
        for (var i = 0; i < event.users.length; i++) {
          if (event.users[i].ip === formattedIP) {
            existingUser = true;
            break;
          }
        }
        //if user ip doesn't exist in db, create new user with ip and other data and store in db
        if (existingUser === false) {
          event.users.push({
            ip: formattedIP,
            votesCast: 0,
            choicesMade: []
          });
          event.save();

        }
        //send back event information and unique user ip address
        res.json({event: event, ip: formattedIP});
      }
    });

  },
  updateVotes: function(req, res) {
    var event_id = req.params.event_id;
    var index = req.body.index;
    var ip = req.ip.split('.').join('-');
    var business_id = req.body.id;
    Event.findOne({event_id: event_id}, function(err, event) {
      if(err) {
        return console.error('Error finding event it on upvote',err);
      }
      //if event id exists
      if(event) {
        event.choices.businesses.forEach(function(business) {
          //increment vote count on specific business upvote click
          if(business.business_id === business_id) {
            business.votes = business.votes + 1;
            //if user ip already exist in specific business data
            //send back 302 Found status code and end
            //this is just for safety caution. User will not be able to click the upvote
            //button once clicked once
            if(business.ips.indexOf(ip) !== - 1) {
              res.status(302).end();
            }
            //once upvote button is clicked, save user ip address to specific business they made
            else {
              business.ips.push(ip);
              event.save(function(err) {
                if(err) {
                  return console.error('Error updating upvote',err);
                }
                res.json({event: event, business: business});
              });
            }
          }
        });
      }
    });
  },
  getMessages: function (event_id, cb) {
    //send all the chat messages from specific event id to socket to populate to DOM
    Event.findOne({event_id: event_id}, function (err, event) {
      if(err) {
        return console.error('Error in sending messages back to client', err);
      }
      if(event) {
        //async issue when returning event.messages, so need to do a callback
        cb(event.messages);
      }
    });
  },
  postMessage: function (data) {
    Event.findOne({event_id: data.eventId}, function (err, event) {
      if(err) {
        return console.error('Error finding same event id for chatroom', err);
      }
      //if event id is found, save new eventId/username/message into db
      if(event) {
        event.messages.push({eventId: data.eventId, name: data.name, text: data.text});
      }
      event.save (function(err) {
        if(err) {
          return console.error('Error in saving new chat messages', err);
        }
      });
    });
  }

};
