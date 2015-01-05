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

        socket.emit('server:test', 'abcdefg');
	}

	var playerJoin = function(data) {
		if(players[data.id] == undefined) return;

		console.log('playerJoin');

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

		// Store player in specific room
		//socket.join(data.game);

		console.log('Server: Player:', data.id ,' is now in a game:', data.game);

		//socket.emit('server:join', 'ajajajajaja');

		//io.to(data.game).emit('server:join', 'ja!!!!');
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

	console.log('testing 124');

	g.io.on('connection', function(socket) {
		console.log('connected with id: ', socket.id);

		socket.on('player:id', function(data) {
			socket.emit('server:id', socket.id);
		});

		socket.emit('connected', { id: socket.id });

		socket.on('player:new', playerNew);

		socket.on('player:join', function(data) {
			if(players[data.id] == undefined) return;

			console.log('playerJoin');

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

			// Store player in specific room
			socket.join(data.game);

			console.log('Server: Player:', data.id ,' is now in a game:', data.game);

			io.to(data.game).emit('server:join', 'ja!!!!');
		});

		//socket.on('player:leave', playerLeave);
		socket.on('player:move', function(data) {

			var data = JSON.parse(data);

			//console.log(data.id);

			//console.log(players);

			// Send new position to all clients in same room
			//io.to(players[data.id].game).emit('server:move', data);

			//console.log('player:move');

			if(players[data.id] == undefined) return;

			players[data.id].x 		= data.x;
			players[data.id].y 		= data.y;
			players[data.id].angle 	= data.angle;


		});
		//socket.on('player:shoot', playerShoot);
		//socket.on('player:die', playerDie);
	});
});