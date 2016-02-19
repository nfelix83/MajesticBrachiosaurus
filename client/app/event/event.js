angular.module('clever.event', [])

.controller('EventController',['$scope','Events','$location', function($scope,Events,$location){
  $scope.event = {};
  
  
  $scope.sendNewEvent = function(){
    //Events.setLocation($scope.event.location);
    
    Events.setEventName($scope.event);

    Events.sendNewEvent($scope.event)
    .then(function(data){
      console.log('data', data);
      $location.path('/' + data.event_id);
    });
  };
}])

.factory('Events', function($http){
  var savedData={}
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
  var setLocation = function(location){
    
    return location;
  }
  var setEventName = function(event){
    console.log(event.event_name,'ohmai');
    savedData=event;
  }
  var get = function(){
    return savedData;
  }

  return {
    sendNewEvent : sendNewEvent,
    //setLocation : setLocation,
    setEventName : setEventName,
    get:get
  };
  
})


