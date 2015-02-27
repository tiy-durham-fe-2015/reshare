app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['VoteFactory', function (VoteFactory) {
  // TODO: load these via AJAX
  var self = this

  self.shares = [];

  // self.chosen;
  // self.upCounter = 0;
  // self.downCounter = 0;

  // self.vote = function (direction) {
  // 	self.chosen = direction;
  // };

  // self.vote = function (color, vote) {
  // 	// document.querySelector(el).onclick = function () {
	 //  	event.target.style.color = color
	 //  // }
  //   if (vote = 'upvote') {

  //   }
  // }

  self.vote = function (color, voted) {
    VoteFactory.vote(color, voted);
  };

  // todo:
  // -add an upvote and downvote counter to each li. Need to create a function within whatever Ashley is pushing to an array
  // that you can access. With that access, you'll need to create the function in your VoteFactory, probably using dependency
  // injection from her controller. The details page should have something like "upvotes= {{upvotes}}".


}]);
