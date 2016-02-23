var Promise = require('bluebird');
var Yelp = require('yelp');

var Event = require('../events/eventModel.js');

var yelp = new Yelp({
  consumer_key: 'XrFzdiNnx_d3yIqlzmwG6g',
  consumer_secret: 'YIFLNTDrzekdfcsdFzXe8ygwBQ0',
  token: 'xVbEwOuDIGQ6AZSs6oA7dS8VF8vyH5is',
  token_secret: 'h4supFvwL9h447AldVkG-WbsXqU'
});

module.exports = {
  search: function(req, res){
    /*
    Query sort:
    0 - Default , weight given to matching search terms
    1 - Weight added to location
    2 - Weight added to rating/# of ratings
    */
    req.query.sort = '0';

    if(req.query.location === undefined){
      var event_id = req.params.event_id;
      Event.findOne({event_id: event_id})
      .then(function (event, err){
        if(err){
          console.log('DB : ' + err)
          res.status(500).send(err);
        }
        if(event !== undefined){
          req.query.location = event.location || 'The North Pole'
          } else{
          req.query.location = '90210'
        }

        req.query.limit = req.query.limit || 5;

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
              console.error('inEach: ' + err);
              res.status(500).send(err);
            });
          })
          .catch(function(err){
            console.error('inSearchThen: ' + err);
            res.status(500).send(err);
          });
        });
      });
    } else {

      req.query.limit = req.query.limit || 5;

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

    //If location radius becomes a required event input

    /*if(req.query.radius_filter === undefined){
        Event.findOne({event_id: req.params.event_id})
        .then(function(err, event){
          if(err){
            res.send(500, err);
          }
          if(event.radius_filter){
            req.query.radius_filter = event.radius_filter;
          } else {
            req.query.radius_filter = 5000;
          }
        });
      }*/
  },

  storeBusiness: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .then(function(event, err){
      if(err){
        res.status(500).send(err);
      }
      event.choices.businesses.push({business_id: req.body.id, votes: 0});
      event.save();
      res.status(201).send();
    });
  },

  getBusinesses: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .exec().then(function(event, err){
      if(err){
        res.status(500).send(err);
      }
      var businesses = [];
      Promise.each(event.choices.businesses, function(business){
        yelp.business(business.business_id)
        .then(function(result){
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
