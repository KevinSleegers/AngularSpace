window.createGame = function(scope, injector, mySocket) {

	console.log('Client: attempting to createGame');

	var el = $('#gameCanvas');

	var w 	= parseInt(el.css('width'), 10),
		h 	= parseInt(el.css('height'), 10);

	var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameCanvas');
	window.game = game;

	console.log('Client: Game variable has been created.');

	// Add states to game.
	game.state.add('Boot', AngularSpace.Boot);
	game.state.add('Preloader', AngularSpace.Preloader);
	game.state.add('Game', AngularSpace.Game);

	game.state.start('Boot');

	scope.$on('$destroy', function() {
		console.log('destroy game');
		game.destroy();
	});

	scope.$on('game:toggleMusic', function() {
		console.log('toggle audio');
    	game.state.states.Game.audio();
	});

	window.onblur = function() {
		scope.$broadcast('game:toggleMusic');
	}

	window.onfocus = function() {	
		scope.$broadcast('game:toggleMusic');
	}

};