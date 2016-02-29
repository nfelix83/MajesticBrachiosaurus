angular.module('nytebyte', [
  'nytebyte.choices',
  'nytebyte.event',
  'nytebyte.chat',
  'nytebyte.services',
  'ngMaterial',
  'ngRoute',
  'ngAnimate',
  'ngFx'
])

.config(function ($locationProvider, $routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController'
    })
    .when('/:event_id', {
      templateUrl: 'app/choices/choices.html',
      controller: 'PreferenceController'
    });

  $locationProvider.html5Mode(true);
})

// Chat element directive
.directive('chat', function () {
  return {
    restrict: 'E',
    controller: 'ChatController',
    templateUrl: '/app/chat/chat.html'
  };
});
