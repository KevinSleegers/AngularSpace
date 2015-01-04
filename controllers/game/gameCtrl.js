angular.module('app.game')
.controller('GameCtrl', function($scope, $injector) {
	console.log('Client: Game Controller');

	$scope.$on('$destroy', function() {
		$scope.$emit('player left!');
	})
});