angular.module('clever.choices', [])


.controller('PreferenceController', function($scope,Preference,$routeParams){
  //TODO send and receive preferences on same page how to receive and send/receive
  $scope.preference={
    'term': ''
  };

  $scope.searchresults = [];
  $scope.choices = [];

  $scope.getEventDetails

  $scope.getChoices=function(){
    Preference.getChoices($scope.choices);
  };

  //receive choices
  $scope.getChoices();

  $scope.sendPreference= function(){
    Preference.sendPreference($scope.preference, $scope.searchresults);
  };
})

.factory('Preference', function($http, $routeParams){
  //send request to yelp api
  var sendPreference=function(term, resultsArray){
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/search',
      params: term
    }).then(function(data,err){
      for(var i = 0; i < data.data.length; i++){
        resultsArray.push(data.data[i]);
      }
    });
  };

  var getChoices=function(choicesArray){
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/saved',
    }).then(function(data,err){
      choicesArray = [];
      for(var i = 0; i < data.data.length; i++){
        choicesArray.push(data.data[i]);
      }
    });
  };

  var storeChoice = function (business_id) {
    $http({
      method: 'Post',
      url: '/' + $routeParams.event_id + '/store',
      data: {
        id: business_id
      }
    }).then(function(data,err){
      if(err){
        console.error(err);
      }
    });
  };

  return {
    sendPreference:sendPreference,
    getChoices:getChoices,
    storeChoice:storeChoice
  };
});
