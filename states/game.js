var bounds = $(window).innerWidth(),
	firebase = new Firebase("https://spacebattalion.firebaseio.com/"),
	bullets = 50
	musicToggle = true,
	socket = io.connect(window.location.origin),
	x = 0,
	y = 0,
	gameId = '';

AngularSpace.Game = function(game) {
	this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.debug;
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.renderer;
    this.rnd;		//	the repeatable random number generator
};

AngularSpace.Game.prototype = {
	create: function() {
		var url = window.location.hash.split('/');
		gameId = url[url.length-1];

	socket.on('server:id', function(data) {
		console.log('received session id from server!');
		console.log(data);
	});

		// start ARCADE system
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// background music
		this.bgMusic = this.game.add.audio('backgroundMusic');
		//this.bgMusic.play('', 0, 1, true);

		// background tiles
		this.bg = this.add.tileSprite(0, 0, bounds, bounds, 'bg');
		this.bg.autoScroll(50, 50);

		this.bullets = this.game.add.group();
		for(var i = 0; i < bullets; i++) {
			var bullet = this.game.add.sprite(0, 0, 'bullet');

	        bullet.animations.add('bulletCollide', [1, 2, 3, 4, 5, 6]);

			bullet.frame = 0;

			this.bullets.add(bullet);

			bullet.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

			bullet.kill();
		}

		this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'myPlane');		
		this.player.anchor.setTo(0.5, 0.5);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

		// if new player connects, create it
		socket.on('server:join', function(data) {
			console.log('server:join');
		});
	},
	update: function() {

		// Move player to cursor, fix angle and rotation(speed)
		var distance = this.game.math.distance(
			this.player.x, this.player.y,
			this.game.input.activePointer.x, this.game.input.activePointer.y
		);

		if(distance > 32) {		

			var rotation = this.game.math.angleBetween(
				this.player.x, this.player.y,
				this.game.input.activePointer.x, this.game.input.activePointer.y
			);

			if(this.player.rotation !== rotation) {
				var delta = rotation - this.player.rotation;

				if(delta > Math.PI) delta -= Math.PI * 2;
				if(delta < -Math.PI) delta += Math.PI * 2;

				if(delta > 0) {
					this.player.angle += 5;
				} else {
					this.player.angle -= 5;
				}

				this.player.body.velocity.x = Math.cos(rotation) * 250;
				this.player.body.velocity.y = Math.sin(rotation) * 250;
			}	

			if(x !== this.player.x || y !== this.player.y) {

				var pos = JSON.stringify({
					game 	: gameId,
					id 		: socket.io.engine.id,
					x 		: this.player.x,
					y  		: this.player.y,
					angle 	: this.player.angle
				});   

				if(this.diff(this.player.x, x) >= 3 || this.diff(this.player.y, y) >= 3) {
					socket.emit('player:move', pos);

					x = this.player.x;
					y = this.player.y;
				}
			}

		} else {
			this.player.body.velocity.setTo(0, 0);
		}

		// Shoot bullet on click or touch
		if(this.game.input.activePointer.isDown) {
			this.shoot();
		}
	},
	render: function() {
		this.game.debug.spriteInfo(this.player, 32, 32);
	},
	shoot: function() {
		if(this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
		if(this.game.time.now - this.lastBulletShotAt < 100) return;
		this.lastBulletShotAt = this.game.time.now;

		var bullet = this.bullets.getFirstDead();

		if(bullet === null || bullet === undefined) return;

		bullet.revive();

		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = true;

		bullet.reset(this.player.x, this.player.y);

		bullet.rotation = this.player.rotation;

		this.physics.arcade.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);
	},
	audio: function() {
		// Toggle audio
		if(this.bgMusic.isPlaying) {
			this.bgMusic.pause();
			musicToggle = false;
		} else {
			this.bgMusic.resume();
			musicToggle = true;
		}
	},
	diff: function(a, b) {
		return Math.abs(a - b);
	},
	playerJoin: function(data) {
		console.log('hey ho lets go!');
	}
};