var Promise = require('bluebird');
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'XrFzdiNnx_d3yIqlzmwG6g',
  consumer_secret: 'YIFLNTDrzekdfcsdFzXe8ygwBQ0',
  token: 'xVbEwOuDIGQ6AZSs6oA7dS8VF8vyH5is',
  token_secret: 'h4supFvwL9h447AldVkG-WbsXqU'
});

var search = function(req, res){
  req.query.sort = '0';
  /*
  0 - Default , weight given to matching search terms
  1 - Weight added to location
  2 - Weight added to rating/# of ratings
  */
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
}

module.exports = search;