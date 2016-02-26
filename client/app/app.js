angular.module('clever', [
  'clever.choices',
  'clever.event',
  'ngMaterial',
  'ngRoute',
  'ngAnimate',
  'ngFx',
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
    controller: 'ChatController',
    templateUrl: '/app/chat/chat.html'
  };
});

