angular.module('CardsAgainstAssembly')
	.controller('rateController', rateController);

function rateController(){
  var vm = this;
  vm.rate = 7;
  vm.max = 10;
  vm.isReadonly = false;
  vm.hoveringOver = function(value) {
  	vm.overStar = value;
  	vm.percent = 100 * (value / vm.max);
  };
  vm.ratingStates = [
  	{stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];  
};

