app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['Share', function (Share) {
  // TODO: load these via AJAX
  var self = this;
  self.shares = [];

  self.newShare = Share();

  self.addShare = function() {
    var share = Share(self.newShare);

    self.shares.push(share);

    self.newShare = Share();
  };
}]);
