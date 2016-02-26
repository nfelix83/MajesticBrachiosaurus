angular.module('clever.choices', [])

.controller('PreferenceController', function($scope, Preference, $routeParams, $mdToast){
  $scope.preference = {
    'term': ''
  };

  $scope.searchresults = [];
  $scope.choices = [];

  $scope.getEventDetails = function () {
    Preference.getEventDetails(function (data) {
      var time = data.event.time.split(":");
      $scope.eventId = data.event.event_id;
      $scope.eventName = data.event.event_name;
      $scope.location = data.event.location;
      $scope.date = data.event.date;
      $scope.time = time[0] + ':' + time[1] + " " + time[2].substr(-2);
      var votedBusiness = [];
      var changeToVotedBusiness = [];

      Preference.getChoices()
      .then(function(res) {
        $scope.choices = [];
        for (var i = 0; i < res.data.length; i++) {
          // Change image url for higher res image
          // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
          res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
          $scope.choices.push(res.data[i]);
        }
        //if the stored ips for specific business contains user's unique ip address
        //grab all the business id into an array 
        data.event.choices.businesses.forEach(function(business) {
          if(business.ips.indexOf(data.ip) !== -1) {
            votedBusiness.push(business.business_id);
          }
        });
        //if the list of bussiness id in array matches any choice within the page
        //disable the button for that user, so that the user cannot upvote again
        res.data.forEach(function(choice) {
          if(votedBusiness.indexOf(choice.id) !== -1) {
            choice.voted = true;
          }
          changeToVotedBusiness.push(choice);
        });
        //re-render choices array into DOM with updated values to disable button for user
        //on reload of page
        $scope.choices = changeToVotedBusiness;
      })
      .catch(function(err) {
        return console.error('Error getting event data', err);
      });

    });
  };

  $scope.sendPreference= function () {
    Preference.sendPreference($scope.preference)
    .then(function (res,err) {
      $scope.searchresults = [];
      // Build array of search results from Yelp
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].image_url === undefined) {
          res.data[i].image_url = Preference.getDefaultImage();
        }
        // Change image url for higher res image
        // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
        res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
        $scope.searchresults.push(res.data[i]);
      }
    });
  };

  $scope.removeChoice = function(choice) {
    var removeIndex = undefined;
    for (var i = 0; i < $scope.choices.length; i++) {
      if ($scope.choices[i].id === choice.id) {
        removeIndex = i;
      }
    }
    if (removeIndex !== undefined) {
      Preference.removeChoice(choice.id)
      .success(function success (response) {
        $scope.choices.splice(removeIndex, 1);
        $mdToast.showSimple('Removed');
      }).error(function error (error, status) {
        if (status === 418) {
          $mdToast.showSimple('User\'s votes exist');
        } else if (status === 403) {
          $mdToast.showSimple('Must be user that submitted');
        }
      });
    }
  };

  $scope.getChoices = function () {
    Preference.getChoices()
    .then(function (res, err) {
      $scope.choices = [];
      for (var i = 0; i < res.data.length; i++) {
        // Change image url for higher res image
        // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
        res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
        $scope.choices.push(res.data[i]);
      }
    });
  };

  $scope.storeChoice = function (choice, index) {
    Preference.storeChoice(choice.id)
    .success(function success (response) {
      $scope.choices.push(choice);
      $mdToast.showSimple('Saved');
      $scope.searchresults.splice(index, 1);
    }).error(function error (error, status) {
      if (status === 418) {
        $mdToast.showSimple('Limit reached');
      }
    });
  };

  $scope.updateVotes = function(choice) {
    //choice refers to specific business user clicks in DOM
    Preference.updateVotes(choice)
    .then(function(resp) {
      //after clicking upvote button, immediately disable upvote button
      resp.data.event.users.forEach(function(user) {
        if(resp.data.business.ips.indexOf(user.ip) !== -1) {
          choice.voted = true;
        }
      });
      //render to DOM the update vote count of specific choice they upvote
      $scope.choices.forEach(function(choice) {
        if(choice.id === resp.data.business.business_id) {
          choice.votes = resp.data.business.votes;
        }
      });

    })
    .catch(function(err) {
      return console.error('Error updating vote', err);
    });
  };

  // Populate rvent details and saved choices on load

  $scope.getEventDetails();
  // $scope.getChoices();
})

.factory('Preference', function ($http, $routeParams) {
  //send request to yelp api
  var defaultImagePath = '../../assets/default_business.jpg';

  var sendPreference = function (term) {
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/search',
      params: term
    });
  };

  var getChoices = function () {
    var choicesArray = [];
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/saved',
    });
  };

  var storeChoice = function (business_id, index) {
    return $http({
      method: 'Post',
      url: '/' + $routeParams.event_id + '/store',
      data: {
        id: business_id
      }
    });
  };

  var removeChoice = function (business_id) {
    return $http({
      method: 'Post',
      url: '/' + $routeParams.event_id + '/remove',
      data: {
        id: business_id
      }
    });
  };

  var getEventDetails = function (cb) {
    $http({
      method: 'POST',
      url: '/' + $routeParams.event_id + '/details',
      data: $routeParams
    })
    .then(function (res) {
      cb(res.data);
    });
  };

  var updateVotes = function(choice) {
    return $http({
      method: 'POST',
      url: '/' + $routeParams.event_id + '/votes',
      data: choice
    });
  };

  var notInChoices = function (newChoice, choices) {
    for (var i = 0; i < choices.length; i++) {
      if (choices[i].id === newChoice.id) {
        return false;
      }
    }
    return true;
  };

  var getDefaultImage = function () {
    return defaultImagePath;
  };

  return {
    sendPreference:sendPreference,
    getChoices:getChoices,
    storeChoice:storeChoice,
    getEventDetails:getEventDetails,
    removeChoice: removeChoice,
    notInChoices: notInChoices,
    getDefaultImage: getDefaultImage,
    updateVotes: updateVotes
  };
});