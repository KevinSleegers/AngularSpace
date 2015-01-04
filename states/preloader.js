AngularSpace.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};

AngularSpace.Preloader.prototype = {
	preload: function() {
		// Sprites inladen voor loading screen		
		this.preloadBar = this.add.graphics(0, 50);
		this.preloadBar.lineStyle(3, 0xffffff, 1);
		this.preloadBar.moveTo(0, 0);
		this.preloadBar.lineTo(this.game.width, 0);

		this.preloadBar.scale.x = 0;
		
	    this.load.audio('backgroundMusic', ['assets/audio/TakingFlight.mp3', 'assets/audio/TakingFlight.ogg']);

		this.load.image('bg', 'assets/img/bg.png');
		this.load.image('myPlane', 'assets/img/spr_myplane.png');

		this.load.spritesheet('bullet', 'assets/img/bullet.png', 32, 32);
	},

	loadUpdate: function() {
		this.preloadBar.scale.x = this.game.load.progress * 0.01;

		console.log(this.game.load.progress);
	},

	create: function() {
		this.preloadBar.cropEnabled = false;

		this.stage.disableVisibilityChange = true;

		this.state.start('Game');
	}
};