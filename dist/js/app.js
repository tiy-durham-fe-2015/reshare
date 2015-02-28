// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

app.factory('Share', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title || '',
      description: spec.description || '',
      url: spec.url || '',
      timestamp: new Date(), // non-mvp
      // author: spec.author, // non-mvp
      // authorId: spec.authorId, // non-mvp
      // upvotes: spec.upvotes || 0, // non-mvp
      // downvotes: spec.downvotes || 0, // non-mvp
      // comments: spec.comments || [], // non-mvp
      // score: function() { // non-mvp
      //   return this.upvotes - this.downvotes;
      // },
      // getComments: function() { // non-mvp
      //   return this.comments;
      // },
      // equals: function(share) { // non-mvp
      //   return (this.url === share.url);
      // },
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares-latest.html',
    controller: 'SharesLatestCtrl',
    controllerAs: 'vm',
    resolve: {
      resources: ['shareService', function(shareService) {
        return shareService.list();
      }]
    }
  };

  $routeProvider.when('/shares/latest', routeDefinition);

}])
.controller('SharesLatestCtrl', ['resources', 'shareService', function (resources, shareService) {
  // TODO: load these via AJAX
  var self = this;
  self.shares = resources;

}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares-new.html',
    controller: 'SharesNewCtrl',
    controllerAs: 'vm',
  };

  $routeProvider.when('/shares/new', routeDefinition);

}])
.controller('SharesNewCtrl', ['Share', 'shareService', '$location', function (Share, shareService, $location) {

  var self = this;
  self.newShare = Share();

  self.addShare = function () {
    var share = Share(self.newShare);

    shareService.addShare(share).then(function () {
      $location.url('#/shares/latest');
    });
  }

}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares-popular.html',
    controller: 'SharesPopCtrl',
    controllerAs: 'vm',
    resolve: {
      resources: ['shareService', function (shareService) {
        return shareService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
  $routeProvider.when('/shares/popular', routeDefinition);

}])
.controller('SharesPopCtrl', ['resources', 'shareService', function (resources, shareService) {
  // TODO: load these via AJAX
  var self = this;
  self.shares = resources;

  self.upVote = function(id) {
    shareService.upVote(id);
    alert('upvote!');
  }

  self.downVote = function(id) {
    shareService.downVote(id);
    alert('downvote!');
  }

  self.unVote = function(id) {
    shareService.unVote(id);
    alert('unvote!');
  }
}]);

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };
  }]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'usersService', function ($route, usersService) {
        var routeParams = $route.current.params;
        return usersService.getByUserId(routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', function (user) {
  this.user = user;
}]);

app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId || '',
      role: spec.role || 'user'
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl',
    controllerAs: 'vm',
    resolve: {
      users: ['usersService', function (usersService) {
        return usersService.list();
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'usersService', 'User', function (users, usersService, User) {
  var self = this;

  self.users = users;

  self.newUser = User();

  self.addUser = function () {
    // Make a copy of the 'newUser' object
    var user = User(self.newUser);

    // Add the user to our service
    usersService.addUser(user).then(function () {
      // If the add succeeded, remove the user from the users array
      self.users = self.users.filter(function (existingUser) {
        return existingUser.userId !== user.userId;
      });

      // Add the user to the users array
      self.users.push(user);
    });

    // Clear our newUser property
    self.newUser = User();
  };
}]);

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.factory('shareService', ['$http', '$q', '$log', function($http, $q, $log) {
  // My $http promise then and catch always
  // does the same thing, so I'll put the
  // processing of it here. What you probably
  // want to do instead is create a convenience object
  // that makes $http calls for you in a standard
  // way, handling post, put, delete, etc
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/res');
    },

    getById: function (resId) {
      if (!resId) {
        throw new Error('getById requires a resource id');
      }

      return get('/api/res/' + resId);
    },

    addShare: function (res) {
      return processAjaxPromise($http.post('/api/res', res));
    },

    upVote: function (resId) {
      var url = 'api/res/' + resId + '/votes';
      return processAjaxPromise($http.post(url, { vote: 1 }));
    },

    downVote: function (resId) {
      var url = 'api/res/' + resId + '/votes';
      return processAjaxPromise($http.post(url, { vote: -1 }));
    },

    unVote: function (resId) {
      var url = 'api/res/' + resId + '/votes';
      return processAjaxPromise($http.post(url, { vote: 0 }));
    }
  };
}]);

app.factory('usersService', ['$http', '$q', '$log', function($http, $q, $log) {
  // My $http promise then and catch always
  // does the same thing, so I'll put the
  // processing of it here. What you probably
  // want to do instead is create a convenience object
  // that makes $http calls for you in a standard
  // way, handling post, put, delete, etc
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/users');
    },

    getByUserId: function (userId) {
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return get('/api/users/' + userId);
    },

    addUser: function (user) {
      return processAjaxPromise($http.post('/api/users', user));
    }
  };
}]);

//# sourceMappingURL=app.js.map