angular.module('App',['newEvent.js'])


.controller('PreferenceController', function($scope,Preference,$routeparams.event_id){
  //TODO send and receive preferences on same page how to receive and send/receive

  $scope.preference={
  	'search': ''
  }


  $scope.receivePreference=function(){
  	Preference.receivePreference();
  }


  $scope.sendPreference= function(){
  	Preference.sendPreference($scope.preference)
  	Preference.receivePreference();
  }
  


})


.factory('Preference', function($http){
   
  //post to server
  var sendPreference=function(input){
  	return $http({
  		method: 'Post',
  		url:'/api/:event_id',
  		data: input

  	}).then(function(err,data){
      //event id
  		res.send(data)
  	})
  }


  var receivePreference=function(){
  	return $http({
  		method: 'Get',
  		url:'/api/:event_id',

  	}).then(function(err,data){
  		res.send(data)
  	})
  }


  return {
		sendPreference:sendPreference,
		receivePreference:receivePreference
	}
})