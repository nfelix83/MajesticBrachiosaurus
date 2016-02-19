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
});
