angular.module('CardsAgainstAssembly')
	.directive('wdiCard', wdiCard);


function wdiCard() {
	var directive = {
		restrict: 'E',	
		templateUrl: 'templates/card-directive.html',
		replace: true,
		scope: {
			question: '@' //means we're expecting a string
		}	
	};
	return directive;
};