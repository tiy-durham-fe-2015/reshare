// app.factory('UserFactory', function() {
app.factory('UserFactory', ['$route', 'usersService', function($route, usersService) {


    return {
    	user: function () {
    		// var routeParams = $route.current.params;
    		// console.log(routeParams)
    		// console.log(routeParams.userid)
		    // var user = usersService.getByUserId(routeParams.userid);
		    // console.log(user);
		    // console.log('hey')
    	}
    };

// });
}]);
