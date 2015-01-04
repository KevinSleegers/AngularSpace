angular.module('app.menu', [])
.config(function($stateProvider) {
	$stateProvider
		.state('auth.menu', {
			url: '/menu',
			templateUrl: 'modules/game/menu/menu.html',
			controller: 'MenuCtrl'
		});
});