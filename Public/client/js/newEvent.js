angular.module('Event',[])

.config(function($routeProvider){
	$routeProvider

      


	  .when('/newEvent', 
	  	{
	  	  controller:'EventController',
	  	  templateUrl: 'newEvent.html' 
	  	})
	  .when('/:event_id',
	    {
	      controller:'userController',
	      templateUrl: 'userPreference.html'

	    })
	  .otherwise('/', 
	    { 
           templateUrl:'home.html'
	    })

})


.controller('EventController', function($scope,Events,$location){

   $scope.event={
   	  'name':'',
   	  'location':''
   }
   
   $scope.sendNewEvent=function(){
   	 Events.sendNewEvent($scope.event).then(function(data){
       $location.path('/:event_id')
   	 })
   }
}

.factory('Events', function($http){

	var sendNewEvent=function(event){
      return $http({
			method: 'Post',
			url:'/api/create',
			data: JSON.stringify(event)
		}).then(function(res){
			return res.data
		})
	}

	return {
		sendNewEvent:sendNewEvent
	}
})







