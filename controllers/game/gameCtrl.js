angular.module('app.game')
.controller('GameCtrl', function($scope, $injector, mySocket) {
	console.log('Client: Game Controller');

	console.log('Verbonden via: ', socket.io.engine.id);

	mySocket.emit('player:id', socket.io.engine.id);

	mySocket.on('server:test', function(data) {
		alert(data);
		console.log('afkomstig van server: ', data);
	});

	mySocket.on('server:join', function(data) {
		console.log('data');
	});

	mySocket.on('server:move', function(data) {
		// Call function within game.js to move player according to data
		console.log(data);
	});

	$scope.$on('$destroy', function() {
		$scope.$emit('player left!');
	});
});