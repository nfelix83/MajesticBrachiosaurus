angular.module('clever.chat',[])

.controller('ChatController', function($scope, socket) {

  $scope.messages=[];

  // initialize the chat with existing messages
  socket.on('init', function (data) {
    $scope.messages = data.messages;
  });


  // add messages locally when received from server
  socket.on('send:message', function (message) {
  	
    $scope.messages.push(message);
  });


  $scope.sendMessage = function () {
    // send message to server
    socket.emit('send:message', {

      event: $scope.eventId,
      name: $scope.name,
      message: $scope.message

    });
    // add the message to our model locally
    $scope.messages.push({
      user: $scope.username,
      text: $scope.message
    });
    // clear message box
    $scope.message = '';

    // Chat.sendChat({user: $scope.username,
    //   text: $scope.message
    // })
  };

});

