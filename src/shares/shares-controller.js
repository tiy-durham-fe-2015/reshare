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

}]);
