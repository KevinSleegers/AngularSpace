var bounds = 5000,
	firebase = new Firebase("https://spacebattalion.firebaseio.com/"),
	bullets = 50,
	players = {},
	musicToggle = true,
	socket = io.connect(window.location.origin),
	oldX = 0,
	oldY = 0,
	gameId = '',
	speed = 250;

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

		cursors = this.input.keyboard.createCursorKeys();

		var self = this;
		socket.on('server:join', function(data) {
			self.playerMove(data);
		});

		socket.on('server:move', function(data) {
			self.playerMove(data);
		});

		// background music
		this.bgMusic = this.game.add.audio('backgroundMusic');
		//this.bgMusic.play('', 0, 1, true);

		// background tiles
		this.bg = this.add.tileSprite(0, 0, bounds, bounds, 'bg');
		this.bg.autoScroll(50, 50);

		this.world.setBounds(0, 0, bounds, bounds);

		// start ARCADE system
		this.physics.startSystem(Phaser.Physics.ARCADE);

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

		this.camera.follow(this.player);	

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
	},
	update: function() {
		this.player.body.velocity.setTo(0, 0);

        if(cursors.left.isDown) {
        	if(cursors.left.isDown && cursors.down.isDown) {
        		this.changePosition('-', this.diagonalSpeed(speed), '+', this.diagonalSpeed(speed), 135);
        	} else if(cursors.left.isDown && cursors.up.isDown) {
        		this.changePosition('-', this.diagonalSpeed(speed), '-', this.diagonalSpeed(speed), -135);
        	} else {
        		this.changePosition('-', speed, '', '', 180);
        	}
        } else if(cursors.right.isDown) {
        	if(cursors.right.isDown && cursors.down.isDown) {
        		this.changePosition('+', this.diagonalSpeed(speed), '+', this.diagonalSpeed(speed), 45);
        	} else if(cursors.right.isDown && cursors.up.isDown) {
        		this.changePosition('+', this.diagonalSpeed(speed), '-', this.diagonalSpeed(speed), -45);
        	} else {
        		this.changePosition('+', speed, '', '', 0);
        	}
        } else if(cursors.up.isDown) {
        	if(cursors.up.isDown && cursors.down.isDown) {
        		this.changePosition('', '', '', '', -90);
        	} else {
        		this.changePosition('','', '-', speed, -90);
        	}
        } else if(cursors.down.isDown) {
        	if(cursors.down.isDown && cursors.up.isDown) {
        		this.changePosition('', '', '', '', 90);
        	} else {
        		this.changePosition('','', '+', speed, 90);
        	}
        }

		// Shoot bullet if spacebar is pressed
		if(this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown) {
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
	changePosition: function(x, xs, y, ys, a) {
		xs == undefined || '' ? xs = 0 : xs;
		ys == undefined || '' ? ys = 0 : ys;

		x == '' ? x = '+' : x;
		y == '' ? y = '+' : y;

		x == '+' ? this.player.body.velocity.x += xs : this.player.body.velocity.x -= xs;
		y == '+' ? this.player.body.velocity.y += ys : this.player.body.velocity.y -= ys;

		this.player.angle = a;

		if(oldX !== this.player.x || oldY !== this.player.y) {
			if(this.diff(this.player.x, oldX) >= 1 || this.diff(this.player.y, oldY) >= 1) {
				socket.emit('player:move', {
		        	game: 	gameId,
		        	id: 	socket.io.engine.id,
		        	x: 		this.player.x,
		        	y: 		this.player.y,
		        	angle: 	this.player.angle
				});

				oldX = this.player.x;
				oldY = this.player.y;
			}
		}
	},
	diagonalSpeed: function(s) {
		var d = Math.sqrt(Math.pow(s, 2) * 2) / 2;
		return s;
	},
	diff: function(a, b) {
		return Math.abs(a - b);
	},
	playerMove: function(data) {
		// check if player exists within client
		if(players[data.id] !== undefined) {
			players[data.id].x 		= data.y;
			players[data.id].y 		= data.y;
			players[data.id].angle 	= data.angle;
		} else {
			players[data.id] 							= this.add.sprite(data.x, data.y, 'myPlane');
	    	players[data.id].enableBody 				= true;
	    	players[data.id].name 						= data.id;
	    	players[data.id].health 					= 100;
	    	players[data.id].angle 						= data.angle;

			players[data.id].anchor.setTo(.5,.5);
			this.physics.enable(players[data.id], Phaser.Physics.ARCADE);

	    	players[data.id].body.collideWorldBounds 	= true;
	    	players[data.id].body.immovable 			= true;
		}
	}
};