angular.module('app.menu')
.controller('MenuCtrl', ['$scope', '$state', '$firebase', 'randomString', 'mySocket', function($scope, $state, $firebase, randomString, mySocket) {
	var ctrl = this;

	$scope.games = {};

	var socket = io();

	mySocket.on('connect', function() {
		$scope.session = socket.io.engine.id;

		// Add new player
		mySocket.emit('player:new', {
			id		: $scope.session,
			name	: 'Kevin',
			status	: 'menu',
			game 	: ''
		});
	});

	mySocket.on('server:games', function(data) {
		$scope.games = data;
	});

	// Let's get all available games from Firebase
	$scope.createGame = function() {
		// Generate random game id (20 characters)
		var id = randomString(20);

		var game = {};

		game.id = id;
		game.players = 1;

		$scope.games[game.id] = game;

		// Join the game!
		$scope.joinGame(id);
	}

	$scope.joinGame = function(id) {
		mySocket.emit('player:join', {
			id		: $scope.session,
			game 	: id
		});

		// load the game
		$state.go('auth.game.play', {id: id});
	}

	/* Game Menu controller
	$scope.startGame = function() {

		// Generate random room id
		var ref = new Firebase("https://spacebattalion.firebaseio.com/");
		var sync = $firebase(ref);

		sync.$push({
			hello: "world"
		}).then(function(newUser) {
			console.log(newUser);
		});

		$state.go('auth.game.play', {id: 5});jsjsjsijiwejrikjaikwejrandmndmdmdmd,mzkenfkwjeirjawermdkdslsaialsweejeijkkjawmer
	}*/
}]);