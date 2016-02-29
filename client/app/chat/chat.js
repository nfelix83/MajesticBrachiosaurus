angular.module('nytebyte.chat', [])

.controller('ChatController', function ($scope, socket) {
  // binding for displayed chat messages
  $scope.messages = [];

  // initialize the chat with existing messages
  socket.on('init', function (data) {
    $scope.messages = data.messages;
  });

  // add messages locally when received from server
  socket.on('send:message', function (message) {
    // don't display broadcasts for events other than this one
    if (message.eventId === $scope.eventId) {
      $scope.messages.push(message);
    }
  });

  $scope.sendMessage = function () {
    // send message to server
    socket.emit('send:message', {
      eventId: $scope.eventId,
      name: $scope.username,
      text: $scope.messageText
    });
    // add the message to our model locally
    $scope.messages.push({
      name: $scope.username,
      text: $scope.messageText
    });
    // clear message box
    $scope.messageText = '';
  };
});
