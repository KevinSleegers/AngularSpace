angular.module('app.game')
.directive('gameCanvas', function($injector) {

	var link = function(scope, el, attrs) {
		console.log('Attempting to create a game');
		createGame(scope, $injector);
	};

	return {
		restrict: 'E',
		template: '<div id="gameCanvas"></div>',
		link: link
	}
});