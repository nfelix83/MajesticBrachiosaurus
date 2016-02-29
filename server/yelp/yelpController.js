var Promise = require('bluebird');
var Yelp = require('yelp');

var Event = require('../events/eventModel.js');

var yelp = new Yelp({
  consumer_key: 'XrFzdiNnx_d3yIqlzmwG6g',
  consumer_secret: 'YIFLNTDrzekdfcsdFzXe8ygwBQ0',
  token: 'xVbEwOuDIGQ6AZSs6oA7dS8VF8vyH5is',
  token_secret: 'h4supFvwL9h447AldVkG-WbsXqU'
});

// Set limit on how many results each IP can save
var choicesLimit = 3;
// Set limit in search results returned
var resultsLimit = 3;

module.exports = {
  search: function(req, res){
    /*
    Query sort:
    0 - Default , weight given to matching search terms
    1 - Weight added to location
    2 - Weight added to rating/# of ratings
    */
    req.query.sort = '0';

    //Conditional allowing local testing without DB
    if(req.params.event_id !== undefined){
      var event_id = req.params.event_id;
      Event.findOne({event_id: event_id})
      .then(function (event, err){
        if(err){
          console.log('DB : ' + err)
          res.status(500).send(err);
        }

        //Default location catch
        if(event.location !== undefined){
          req.query.location = event.location;
        } else {
          req.query.location = '90210';
        }

        //Default search radius check
        if(event.radius !== undefined){
          req.query.radius_filter = event.radius * 1600;
        } else {
          req.query.radius_filter = 5000;
        }

        req.query.limit = req.query.limit || resultsLimit;

        //Increases number of search results by number of saved choices
        var expectedLimit = parseInt(req.query.limit);
        req.query.limit += event.choices.businesses.length;

        yelp.search(req.query)
        .then(function(data){
          var businesses = [];
          for (var i = 0; i < data.businesses.length; i++) {
            var existingChoice = false;
            for (var j = 0; j < event.choices.businesses.length; j++) {
              if (event.choices.businesses[j].business_id === data.businesses[i].id) {
                existingChoice = true;
              }
            }
            if (existingChoice === false) {
              businesses.push(data.businesses[i]);
            }
            if(businesses.length === expectedLimit || businesses.length === data.businesses.length){
              res.json(businesses);
            }
          }
        })
        .catch(function(err){
          console.log(err)
          console.error('inSearchThen: ' + err);
          res.status(500).send(err);
        });
      });
    } else {

      //Initially used for ease of testing
      //Search still using both Search and Business API

      req.query.limit = req.query.limit || resultsLimit;
      req.query.location = req.query.location || '90210';


      yelp.search(req.query)
      .then(function(data){
        var businesses = [];
        Promise.each(data.businesses, function(business){
          yelp.business(business.id)
          .then(function(result){
            businesses.push(result);
            if(businesses.length === parseInt(req.query.limit)){
              res.json(businesses);
            }
          })
          .catch(function(err){
            console.error(err);
            res.status(500).send(err);
          });
        })
        .catch(function(err){
          console.error(err);
          res.status(500).send(err);
        });
      });
    }
  },

  storeBusiness: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .then(function(event, err){
      var formattedIP = req.ip.split('.').join('-');
      if(err){
        console.log('Event Error');
        res.status(500).send(err);
      }
      //FormattedIP no longer needed
      var formattedIP = req.ip.split('.').join('-');

      var userIndex = -1;
      for (var i = 0; i < event.users.length; i++) {
        if (event.users[i].ip === formattedIP) {
          userIndex = i;
          break;
        }
      }
      //No user error catch
      if (userIndex < 0) {
        console.log('User not found.');
        res.status(500).send('Please reload event page');
      }
      //Add business ID to user's choices array if not at limit
      if (event.users[userIndex].choicesMade.length < choicesLimit) {
        event.choices.businesses.push({business_id: req.body.id, votes: 0, user: formattedIP});
        event.users[userIndex].choicesMade.push(req.body.id);
        event.save();
        res.status(201).send();
      } else {
        //Teapot for limit
        res.status(418).send();
      }
    });
  },

  removeBusiness: function(req, res) {
    Event.findOne({event_id: req.params.event_id})
    .then(function(event, err){
      var formattedIP = req.ip.split('.').join('-');
      if(err){
        res.status(500).send(err);
      }
      //Refactor out to helper function getUserIndex
      var formattedIP = req.ip.split('.').join('-');
      var userIndex = -1;
      for (var i = 0; i < event.users.length; i++) {
        if (event.users[i].ip === formattedIP) {
          userIndex = i;
          break;
        }
      }
      if (userIndex < 0) {
        res.status(500).send('Please reload event page');
      }

      var index = -1;
      for (var i = 0; i < event.choices.businesses.length; i++) {
        if (event.choices.businesses[i].business_id === req.body.id) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        res.status(500).send();
      } else if (event.choices.businesses[index].user !== formattedIP) {
        //Choice does not belong to user
        res.status(403).send();
      } else if (event.choices.businesses[index].votes > 0 && (event.choices.businesses[index].votes > 1 || event.choices.businesses[index].ips[0] !== formattedIP)) {
        //Choice has been voted on by other users
        res.status(418).send();
      } else {
        event.choices.businesses.splice(index, 1);
        event.users[userIndex].choicesMade.splice(event.users[userIndex].choicesMade.indexOf(req.body.ip), 1);
        event.save();
        res.status(200).send();
      }
    });
  },

  getBusinesses: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .exec().then(function(event, err){
      if(err){
        res.status(500).send(err);
      }
      var businesses = [];
      //Yelp does not allow local storage of their API's objects, looks up each choice by saved businessID
      Promise.each(event.choices.businesses, function(business){
        yelp.business(business.business_id)
        .then(function(result){
          result.votes = business.votes;
          businesses.push(result);
          if(businesses.length === event.choices.businesses.length){
            res.json(businesses);
          }
        })
        .catch(function(err){
          console.error('inEach: ' + err);
          res.status(500).send(err);
        });
      })
      .catch(function(err){
        console.error('inSearchThen: ' + err);
        res.status(500).send(err);
      });
    });
  }
};
