angular.module('clever.event', [])

.controller('EventController',['$scope','Events','$location', function($scope,Events,$location){
  $scope.event = {};

  
  $scope.sendNewEvent = function(){
    Events.sendNewEvent($scope.event)
    .then(function(data){
      console.log('data', data);
      $location.path('/' + data.event_id);
    });
  };
}])

.factory('Events', function($http){

  var sendNewEvent = function(event){
    return $http({
      method: 'POST',
      url:'/create',
      data: event
    })
    .then(function(res){
      return res.data;
    });
  };

  return {
    sendNewEvent: sendNewEvent
  };
  
});
