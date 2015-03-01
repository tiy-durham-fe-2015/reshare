app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/shares/new-share', {
    controller: 'NewShareCtrl',
    controllerAs: 'vm',
    templateUrl: 'shares/new-share.html'
  });
}]).controller('NewShareCtrl', ['$location', 'Share', 'shareService', function ($location, Share, shareService) {
  var self = this;

  self.share = Share();

  self.cancelEdit = function () {
    self.viewShares();
  };

  self.viewShares = function () {
    $location.path('/shares');
  };

  self.addShare = function () {
    shareService.addShare(self.share).then(self.viewShares);
  };

}]);
