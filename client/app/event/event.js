// angular.module('clever.event', [])
//   .controller('EventController', function($scope){
//   });

angular.module('Event',[])

.controller('EventController',['$scope','Events','$location', function($scope,Events,$location){
   $scope.event={
      'event_name':'',
      'location':''
   }
   $scope.sendNewEvent=function(){
     Events.sendNewEvent($scope.event).then(function(data){
       $location.path('/' + data.event_id)
     })
   }
}])
.factory('Events', function($http){
  var sendNewEvent=function(event){
      return $http({
      method: 'Post',
      url:'/create',
      data: JSON.stringify(event)
    }).then(function(res){
      return res.data
    })
  }
  return {
    sendNewEvent:sendNewEvent
  }
})
