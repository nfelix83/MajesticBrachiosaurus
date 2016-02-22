angular.module('clever.choices', [])

.controller('PreferenceController', function($scope, Preference,$routeParams){
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
    $scope.searchresults = [];
    Preference.sendPreference($scope.preference, $scope.searchresults);
  };

  $scope.getChoices = function () {
    Preference.getChoices()
    .then(function (res, err) {
      $scope.choices = [];
      for (var i = 0; i < res.data.length; i++) {
        $scope.choices.push(res.data[i]);
      }
    });
  };

  $scope.storeChoice = Preference.storeChoice;

  $scope.getEventDetails();
  $scope.getChoices();
})

.factory('Preference', function ($http, $routeParams) {
  //send request to yelp api
  var defaultImagePath = '../../assets/default_business.jpg';

  var sendPreference = function (term, resultsArray) {
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/search',
      params: term
    }).then(function (res,err) {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].image_url === undefined) {
          res.data[i].image_url = defaultImagePath;
        }
        resultsArray.push(res.data[i]);
      }
    });
  };

  var getChoices = function () {
    var choicesArray = [];
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/saved',
    })
  };

  var storeChoice = function (business_id) {
    $http({
      method: 'Post',
      url: '/' + $routeParams.event_id + '/store',
      data: {
        id: business_id
      }
    }).then(function (data,err) {
      if(err){
        console.error(err);
      } else {
        getChoices();
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

  return {
    sendPreference:sendPreference,
    getChoices:getChoices,
    storeChoice:storeChoice,
    getEventDetails:getEventDetails
  };
});
