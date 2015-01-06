angular.module('app.game', [
	'ui.router'
])
.config(function($stateProvider) {
	$stateProvider
		.state('auth.game', {
			url: '/game',
			abstract: true,
			template: '<div class="game"><div ui-view></div></div>'
		})
		.state('auth.game.play', {
			url: '/:id',
			template: '<game-canvas></game-canvas>',
			controller: 'GameCtrl'
		});
})