angular.module('clever.choices', [])


.controller('PreferenceController', function($scope, Preference,$routeParams){
  //TODO send and receive preferences on same page how to receive and send/receive
  $scope.preference={
    'term': ''
  };

  
  
  $scope.getEventDetails = function(){
    console.log('rof')
    Preference.getEventDetails()
    
  }

  $scope.getEventDetails();
  
  $scope.searchresults = [];
  $scope.choices = [];

  

  $scope.getChoices=function(){
    Preference.getChoices($scope.choices);
  };

  //receive choices from yelp
  
  $scope.getChoices();
  

  $scope.sendPreference= function(){
    $scope.searchresults = [];
    Preference.sendPreference($scope.preference, $scope.searchresults);
  };

  $scope.storeChoice = function (business_id) {
    Preference.storeChoice(business_id);
    return true;
  }
})

.factory('Preference', function($http, $routeParams){
  //send request to yelp api

  var defaultImagePath = 'http://www.acclaimclipart.com/free_clipart_images/generic_sign_for_a_restaurant_with_a_spoon_and_fork_crossed_to_suggest_a_dining_establishment_0515-1011-1202-2158_SMU.jpg';

  var sendPreference=function(term, resultsArray){
    return $http({
      method: 'Get',
      url:'/' + $routeParams.event_id + '/search',
      params: term
    }).then(function(data,err){

      for(var i = 0; i < data.data.length; i++){
        console.log(data.data[i].image_url)
        if(data.data[i].image_url === undefined){
          data.data[i].image_url = defaultImagePath;
        }
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

  var getEventDetails = function(){
    $http({
      method: 'Get',
      url: '/' + $routeParams.event_id + '/details',
    }).then(function(data){
      console.log(data,'lol')
    })

  }


  return {
    sendPreference:sendPreference,
    getChoices:getChoices,
    storeChoice:storeChoice,
    getEventDetails:getEventDetails
  };
});
