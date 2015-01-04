module.exports = (function(app, io) {
	var g = {
		io: io,
		maps: {}
	};

	var players = {};
	var games = {};

	var playerNew = function(data) {

		var player = {};

		player.id 		= data.id;		
		player.name		= data.name;
		player.status 	= data.status;
		player.game		= '';
		player.x 		= 0;
		player.y 		= 0;
		player.angle 	= 0;
		player.boss		= false;

		players[player.id] = player;

        io.sockets.connected[data.id].emit('server:games', games);
        console.log('Server: Sent available games to client!');
	}

	var playerJoin = function(data) {
		if(players[data.id] == undefined) return;

		players[data.id].game = data.game;

		if(games[data.game] == undefined) {
			// create game
			var game = {};

			game.id 		= data.game;
			game.players 	= 1;

			games[data.game] = game;

			console.log('new room created!');
		}  else {
			games[data.game].players += 1;

			console.log('added a player to existing game');
		}

		console.log('Server: Player:', data.id ,' is now in a game:', data.game);
	};

	var playerLeave = function() {

	};

	var playerMove = function(data) {
		var data = JSON.parse(data);

		if(players[data.id] == undefined) return;

		players[data.id].x 		= data.x;
		players[data.id].y 		= data.y;
		players[data.id].angle 	= data.angle;
	}

	g.io.on('connection', function(socket) {
		socket.emit('connected', { id: socket.id });

		socket.on('player:new', playerNew);
		socket.on('player:join', playerJoin);
		//socket.on('player:leave', playerLeave);
		socket.on('player:move', playerMove);
		//socket.on('player:shoot', playerShoot);
		//socket.on('player:die', playerDie);
	});
});