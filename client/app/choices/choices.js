angular.module('clever.choices', [])

.controller('PreferenceController', function($scope, Preference, $routeParams, $mdToast){
  //TODO send and receive preferences on same page how to receive and send/receive
  $scope.preference = {
    'term': ''
  };


  $scope.searchresults = [];
  $scope.choices = [];

  $scope.getEventDetails = function () {
    Preference.getEventDetails(function (data) {
      $scope.eventName = data.event_name;
      $scope.location = data.location;
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
        res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
        $scope.searchresults.push(res.data[i]);
      }
    });
  };


  $scope.getChoices = function () {
    Preference.getChoices()
    .then(function (res, err) {
      $scope.choices = [];
      for (var i = 0; i < res.data.length; i++) {
        console.log(res.data[i]);
        $scope.choices.push(res.data[i]);
      }
    });

  };

  $scope.storeChoice = function (choice) {
    if (Preference.notInChoices(choice, $scope.choices)) {
      Preference.storeChoice(choice.id)
      .then(function success (response) {
        $scope.choices.push(choice);
        $mdToast.showSimple('Saved');
        }, function error (response) {
          if (response.status === 418) {
            $mdToast.showSimple('Limit reached');
          }
      });
    } else {
      $mdToast.showSimple('Already saved');
    }
    return true;
  };

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

  var storeChoice = function (business_id) {
    return $http({
      method: 'Post',
      url: '/' + $routeParams.event_id + '/store',
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
      console.log(res.data);
      cb(res.data);
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

    notInChoices: notInChoices,
    getDefaultImage: getDefaultImage

  };
});
