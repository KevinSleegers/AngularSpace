angular.module('app.logout', [
	'ui.router'
])
.config(function($stateProvider) {
	$stateProvider
		.state('auth.logout', {
			url: '/logout',
			controller: 'LogoutCtrl',
			templateUrl: 'modules/logout/logout.html'
		});
})
.controller('LogoutCtrl', function(auth, $scope) {
	auth.signout();
})