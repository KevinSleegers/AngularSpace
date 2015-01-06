angular.module('app.game')
.controller('GameCtrl', function($scope, $state, $injector, mySocket, socketService) {

	// Player joined a game
	var gameId;

	for (var prop in $state.params) {
     	gameId = $state.params[prop];
     	break;
	}

	console.log(socketService.session);

	socket.emit('player:join', {
		id		: socketService.session,
		game 	: gameId
	});

	console.log('SocketService: connected with id:', socketService.session);

	socket.io.engine.id = socketService.session;
	
	console.log('Phaser game:');
	console.log(window.game);
	console.log('- - - - -');

	console.log('Client: Game Controller');

	mySocket.emit('player:id', socketService.session);

	mySocket.on('server:id', function(data) {
		//alert(data);
	});

	mySocket.on('server:join', function(data) {
		// Call function within game.js to create player according to data
		console.log('someone joined.');
	});

	mySocket.on('server:move', function(data) {
		// Call function within game.js to move player according to data
    	window.game.state.states.Game.playerMove(data);

		//console.log(data);
	});

	$scope.$on('$destroy', function() {
		$scope.$emit('player left!');
	});
});