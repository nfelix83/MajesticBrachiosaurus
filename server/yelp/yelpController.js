var Promise = require('bluebird');
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'XrFzdiNnx_d3yIqlzmwG6g',
  consumer_secret: 'YIFLNTDrzekdfcsdFzXe8ygwBQ0',
  token: 'xVbEwOuDIGQ6AZSs6oA7dS8VF8vyH5is',
  token_secret: 'h4supFvwL9h447AldVkG-WbsXqU'
});

module.exports = {
  search: function(req, res){
    req.query.sort = '0';
    /*
    0 - Default , weight given to matching search terms
    1 - Weight added to location
    2 - Weight added to rating/# of ratings
    */

    if(req.query.location === undefined){
      Event.findOne({event_id: req.params.event_id})
      .then(function(err, event){
        if(err){
          res.send(500, err);
        }
        req.query.location = event.location;
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
          res.send(500, err);
        });
      })
      .catch(function(err){
        console.error(err);
        res.send(500, err);
      });
    });
  },

  storeBusiness: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .then(function(err, event){
      if(err){
        res.send(500, err);
      }
      event.businesses.push({business_id: req.body.id, votes: 0});
    });
  },

  getBusinesses: function(req, res){
    Event.findOne({event_id: req.params.event_id})
    .then(function(err, event){
      if(err){
        res.send(500, err);
      }
      res.json(event.businesses);
    });
  }
}