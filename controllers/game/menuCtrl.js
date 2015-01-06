angular.module('app.menu')
.controller('MenuCtrl', ['$scope', '$state', '$firebase', 'randomString', 'mySocket', 'socketService', function($scope, $state, $firebase, randomString, mySocket, socketService) {
	var ctrl = this;

	mySocket.on('connect', function() {
		console.log('on Connect!');

		$scope.session = socket.io.engine.id;
		console.log('MenuCTRL : Verbonden via: ', $scope.session);

		// Store current id in service socketService
		socketService.create(socket.io.engine.id);

		// Add new player
		mySocket.emit('player:new', {
			id		: socketService.session,
			game 	: ''
		});

		$scope.games = {};

		mySocket.on('server:games', function(data) {
			console.log('updating game list');
			$scope.games = data;
		});

		$scope.$watch('games', function(newVal, oldVal) {
			$scope.games = newVal;
		}, true);
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
		/*console.log('Joining game..');

		mySocket.emit('player:join', {
			id		: $scope.session,
			game 	: id
		});*/

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