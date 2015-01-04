var app = angular.module('app', [
	'btford.socket-io',
	'angular-random-string',
	'auth0', 
	'angular-storage', 
	'angular-jwt',
	'firebase',
	'app.auth',
	'app.login',
	'app.logout',
	'app.menu', 
	'app.game'
])
.config(function($urlRouterProvider, $stateProvider, authProvider) {
	$urlRouterProvider.otherwise('/');

	// Even if user is in root url, authentication is needed to go to next steps!
	$stateProvider
		.state('auth.home', {
			url: '/'
		});

	authProvider.init({		
		domain: 'kevinsleegers.auth0.com',
		clientID: 'UrO7JP3c1HCamLDnpKpFSMfPJPWNIOMw',
		callbackURL: location.href,
		loginState: 'login'
	});
})
.factory('mySocket', function(socketFactory) {
	return socketFactory();
})
.run(function($rootScope, $state, auth, store, jwtHelper) {
	auth.hookEvents();

	$rootScope.$on('$locationChangeStart', function() {
		if(!auth.isAuthenticated) {
			var token = store.get('token');

			if(token) {
				if(!jwtHelper.isTokenExpired(token)) {
					auth.authenticate(store.get('profile'), token);
				} else {
					$state.go('login');
				}
			}
		}
	})
});