angular.module('nytebyte.event', [])

.controller('EventController',['$scope','Events','$location', function($scope,Events,$location){
  $scope.event = {};
  //set default choices of radius to show in home page
  $scope.radius = [1, 5, 10, 15, 20, 25];
  //show default date in home page in calendar
  $scope.event.date = new Date();
  $scope.newDate = new Date();
  //filter out dates from today and on, so user cannot create event from dates that is passed
  $scope.minDate = new Date(
      $scope.newDate.getFullYear(),
      $scope.newDate.getMonth(),
      $scope.newDate.getDate()
      );

  //post to server to save newly created event and get newly created event_id from server
  $scope.sendNewEvent = function(){
    $scope.event.time = $scope.event.time.toLocaleTimeString();
    $scope.event.date = $scope.event.date.toDateString();
    Events.sendNewEvent($scope.event)
    .then(function(data){
      //redirect user to url with newly created event_id
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
    })
    .catch(function(err) {
      return console.error('Error creating event data', err);
    });
  };

  return {
    sendNewEvent : sendNewEvent
  };

});


