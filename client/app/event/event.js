angular.module('nytebyte.event', [])

.controller('EventController',['$scope','Events','$location', function($scope,Events,$location){
  $scope.event = {};
  $scope.radius = [1, 5, 10, 15, 20, 25];
  $scope.event.date = new Date();
  $scope.newDate = new Date();
  $scope.minDate = new Date(
      $scope.newDate.getFullYear(),
      $scope.newDate.getMonth(),
      $scope.newDate.getDate()
      );


  $scope.sendNewEvent = function(){
    $scope.event.time = $scope.event.time.toLocaleTimeString();
    $scope.event.date = $scope.event.date.toDateString();
    Events.sendNewEvent($scope.event)
    .then(function(data){
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
    sendNewEvent : sendNewEvent
  };

});


