angular.module('clever.choices', [])
  .controller('ChoicesController', function($scope){
})

.controller('PreferenceController', function($scope,Preference,$routeParams){
  //TODO send and receive preferences on same page how to receive and send/receive
  $scope.preference={
    'term': ''
  };
  $scope.getChoices=function(){
    Preference.getChoices();
  };
  //receive choices
  $scope.getChoices();
  $scope.sendPreference= function(){
    Preference.sendPreference($scope.preference);
  };
})

.factory('Preference', function($http, $routeParams){
  //send request to yelp api
  var sendPreference=function(term){
    return $http({
      method: 'Post',
      url:'/' + $routeParams.event_id + '/search',
      data: term
    }).then(function(err,data){
      res.send(data);
    });
  };
  var getChoices=function(){
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/saved',
    }).then(function(err,data){
      res.send(data);
    });
  };
  return {
    sendPreference:sendPreference,
    getChoices:getChoices
  };
});
