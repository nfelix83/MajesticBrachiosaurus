angular.module('clever.choices', [])

.controller('PreferenceController', function($scope, Preference, $routeParams, $mdToast){
  $scope.preference = {
    'term': ''
  };

  $scope.searchresults = [];
  $scope.choices = [];

  $scope.getEventDetails = function () {
    Preference.getEventDetails(function (data) {
      console.log(data);
      var time = data.event.time.split(":");
      $scope.eventId = data.event.event_id;
      $scope.eventName = data.event.event_name;
      $scope.location = data.event.location;
      $scope.date = data.event.date;
      $scope.time = time[0] + ':' + time[1] + " " + time[2].substr(-2);
      var votedBusiness = [];
      var changeToVotedBusiness = [];
//commit purpose
      Preference.getChoices()
      .then(function(res) {
        $scope.choices = [];
        for (var i = 0; i < res.data.length; i++) {
          // Change image url for higher res image
          // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
          res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
          $scope.choices.push(res.data[i]);
        }
        data.event.choices.businesses.forEach(function(business) {
          // data.users.forEach(function(user) {
            console.log(data.ip);
            if(business.ips.indexOf(data.ip) !== -1) {
              votedBusiness.push(business.business_id);
            }
          // });
          // if(business.ips.indexOf(data.users[0].ip) !== -1) {
          //   votedBusiness.push(business.business_id);
          // }
        });
        res.data.forEach(function(choice) {
          if(votedBusiness.indexOf(choice.id) !== -1) {
            choice.voted = true;
          }
          changeToVotedBusiness.push(choice);
        });

        $scope.choices = changeToVotedBusiness;
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
          res.data[i].stored = false;
        }
        // Change image url for higher res image
        // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
        res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
        $scope.searchresults.push(res.data[i]);
      }
    });
  };

  $scope.removeChoice = function(choice) {
    $scope.choiceToRemove = $scope.choices.indexOf(choice);
    $scope.choices.splice($scope.choiceToRemove,1);
    Preference.removeChoice(choice.id);
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
      $scope.searchresults[index].stored = true;
    }).error(function error (response) {
      if (response.status === 418) {
        $mdToast.showSimple('Limit reached');
        return false;
      }
    });
  };

  $scope.updateVotes = function(choice) {
    Preference.updateVotes(choice)
    .then(function(resp) {
      resp.data.event.users.forEach(function(user) {
        if(resp.data.business.ips.indexOf(user.ip) !== -1) {
          choice.voted = true;
        }
      });

      $scope.choices.forEach(function(choice) {
        if(choice.id === resp.data.business.business_id) {
          choice.votes = resp.data.business.votes;
        }
      });

    });
  };

  // Populate rvent details and saved choices on load

  $scope.getEventDetails();
  $scope.getChoices();
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
