var AngularSpace = {};

AngularSpace.Boot = function(game) {};

AngularSpace.Boot.prototype = {
	preload: function() {
		// Preload assets here!
		this.load.image('preloaderBar', 'assets/img/preloadbar.png');
	},

	create: function() {
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;

		console.log('Loaded: Boot State');

		this.state.start('Preloader');
	}
}