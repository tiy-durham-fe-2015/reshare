app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl',
    controllerAs: 'vm',
    resolve: {
      users: ['usersService', function (usersService) {
        return usersService.list();
        //Returns a list of users as an array..
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'usersService', 'User', function (users, usersService, User) {
  var self = this;

  self.users = users;
  console.log(users);

  self.newUser = User();

  self.addUser = function () {
    // Make a copy of the 'newUser' object
    var newUser = User(self.newUser);

    // Add the user to our service
    usersService.addUser(newUser).then(function () {
      // If the add succeeded, remove the user from the users array
      self.users = self.users.filter(function (existingUser) {
        return existingUser.userId !== newUser.userId;
      });

      // Add the user to the users array
      self.users.push(newUser);
    });

    // Clear our newUser property
    self.newUser = User();

    console.log(users);
  };
}]);
