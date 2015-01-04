angular.module('app.auth', [
	'ui.router'
])
.config(function($stateProvider) {
	$stateProvider
		.state('auth', {
			abstract: true,
			controller: 'AuthCtrl',
			templateUrl: 'modules/authenticated/authenticated.html',
			data: {
				requiresLogin: true
			}
		});
})
.controller('AuthCtrl', function($rootScope, $scope, $state, $http, auth) {
	$scope.auth = auth;

	$state.go('auth.menu');

	$scope.logout = function() {
		auth.signout();
		$state.go('login');
	}

	$scope.audio = function() {
		$rootScope.$broadcast('game:toggleMusic');
	}
});