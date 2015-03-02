app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['shareService', function (shareService) {
        return shareService.list();
      }],
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shareService', 'users', 'shares', 'Share', 'VoteFactory', 
  function (shareService, users, shares, Share, VoteFactory) {

  var self = this;

  self.shares = shares;

  // console.log(shares);
  console.log(self.shares);

  self.vote = function (color, voted) {
    var indexNum = $(event.target).parent().index();
    var id = self.shares[indexNum]._id;
    // var votes = shareService.getVotes(id);
    // console.log(votes)
    var upvotes = self.shares[indexNum].upvotes;
    var downvotes = self.shares[indexNum].downvotes;
    VoteFactory.vote(color, voted, id, upvotes, downvotes)
  };
  
}]);
