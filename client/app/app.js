angular.module('clever', [
  'clever.choices',
  'clever.event',
  'ngMaterial',
  'ngRoute'
])
.config(function($locationProvider, $routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController'
    })
    .when('/choices', {
      templateUrl : 'app/choices/choices.html',
      controller: 'ChoicesController'
    });

  $locationProvider.html5Mode(true);
});
