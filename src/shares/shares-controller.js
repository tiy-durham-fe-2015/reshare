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

  self.delete = function (shareId) {
    shareService.deleteShare(shareId).then($route.reload());
  };
  //
  // self.view = function (shareId) {
  //   shareService.getShareById(shareId).then();
  // //ng-hide a copy of the form, ng-repeat(?) to populate the form with current share information which is retrieved by
  // //id when the edit button is ng-click(ed).  Haha.  Submit button submits the form.  The API has function to deal deal
  // //with duplicate user.  It states to replace current info with new info.
  // };

}]);
