angular.module('app.login', [
	'ui.router'
])
.config(function($stateProvider, authProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'LoginCtrl',
			templateUrl: 'modules/login/login.html'
		});

	authProvider.on('loginSuccess', function($state) {
		$state.go('auth.menu');
	});

	authProvider.on('loginFailure', function(error) {
		console.log('There was an error', error);
	});
})
.controller('LoginCtrl', function(auth, $scope, store, $state) {
	$scope.login = function() {
		auth.signin({
			popup: 		true,
			chrome: 	true,
			standalone: true,
			dict: 		'en'
		}, function(profile, id_token, access_token, state, refresh_token) {
			store.set('profile', profile);
			store.set('token', id_token);

			$state.go('auth.menu');
		}, function(error) {
			console.log('There was an error:', error);
		});
	}
})