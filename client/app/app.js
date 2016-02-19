angular.module('clever', [
  'clever.choices',
  'ngMaterial',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/choices', {
      templateUrl : 'app/choices/choices.html',
      controller: 'ChoicesController'
    });

});
