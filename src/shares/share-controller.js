app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/share.html',
    controller: 'ShareCtrl',
    controllerAs: 'vm',
    resolve: {
      share: ['$route', 'shareService', function ($route, shareService) {
        var routeParams = $route.current.params;
        console.log(routeParams.shareid);
        return shareService.getByShareId(routeParams.shareid);
      }]
    }
  };

  $routeProvider.when('/shares/:shareid', routeDefinition);
}])
.controller('ShareCtrl', ['share', function (share) {
  this.share = share;
}]);
