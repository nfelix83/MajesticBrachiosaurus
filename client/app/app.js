angular.module('clever', [
  'clever.choices',
  'clever.event',
  'ngMaterial',
  'ngRoute',
  'clever.chat',
  'clever.services'
])

.config(function($locationProvider, $routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController'
    })
    .when('/choices', {
      templateUrl: 'app/choices/choices.html',
      controller: 'PreferenceController'
    })
    .when('/:event_id', {
      templateUrl : 'app/choices/choices.html',
      controller: 'PreferenceController'
    })
    .otherwise('/', {
        templateUrl:'home.html'
    });

  $locationProvider.html5Mode(true);
})

.directive('chat', function(){
  return {
    restrict: 'E',
    templateUrl: '/app/chat/chat.html'
  }
})

