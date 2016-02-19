angular.module('clever', [
  'clever.choices',
  'clever.event',
  'ngMaterial',
  'ngRoute'
])
.config(function($locationProvider, $routeProvider, $httpProvider, $routeParams){
  $routeProvider
    .when('/', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController'
    })
    .when('/:event_id', {
      templateUrl : 'app/choices/choices.html',
      controller: 'PreferencesController'
    })
    .otherwise('/', {
        templateUrl:'home.html'
    });

  $locationProvider.html5Mode(true);
});

// .config(function($routeProvider){
//   $routeProvider
//     .when('/newEvent',
//       {
//         controller:'EventController',
//         templateUrl: 'newEvent.html'
//       })
//     .when('/:event_id',
//       {
//         controller:'userController',
//         templateUrl: 'userPreference.html'
//       })
//     .otherwise('/',
//       {
//            templateUrl:'home.html'
//       })

// })
