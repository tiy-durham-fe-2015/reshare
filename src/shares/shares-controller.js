app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['shareService', function (shareService) {
        return shareService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shareService', 'shares', 'Share', 'VoteFactory', '$route', function (shareService, shares, Share, VoteFactory, $route) {

  var self = this;

  self.shares = shares;

  self.vote = function (color, voted) {
    VoteFactory.vote(color, voted);
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
