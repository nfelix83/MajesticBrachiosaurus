angular.module('clever.chat',[])

.controller('ChatController', function($scope, socket) {
  $scope.messages=[];

  // initialize the chat with existing messages
  socket.on('init', function (data) {
    $scope.messages = data.messages;
  });

  // add messages locally when received from server
  socket.on('send:message', function (message) {
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });
  });

  $scope.sendMessage = function () {
    // send message to server
    socket.emit('send:message', {
      eventId: $scope.eventId,
      name: $scope.name,
      text: $scope.message
    });
    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });
    // clear message box
    $scope.message = '';
  };
});

