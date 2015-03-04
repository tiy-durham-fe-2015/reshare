// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

$(function () {

	// console.log($('.main-checkbox').prop('checked'))

	// if ($('.main-checkbox').prop('checked')) {
	// 	console.log('eh')
	// 	$('.site-header').css({
	// 		'height': '155px'
	// 	})
	// };

	// function screenWidthAdjustment () {
	// 	console.log('eh')
	// 	var move = $('.header-new-link-button').detach();
	// 	move.appendTo('.header-login-button')
	// }

	// function screenWidthRevert () {
	// 	var move = $('.header-new-link-button').detach();
	// 	move.appendTo('.links-div')
	// }

	// if ($(window).width() < 750) {
	//     screenWidthAdjustment()
	// }

	// $(window).resize(function() {
	//     if ($(window).width() < 750) {
	//         screenWidthAdjustment()
	//     }
	// });

	// $(window).resize(function() {
	//     if ($(window).width() > 750) {
	//         screenWidthRevert()
	//     }
	// });

});
app.controller('MainNavCtrl',
  ['$location', 'StringUtil', 'usersService', function($location, StringUtil, usersService) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };

    usersService.currentUser().then(function (data) {
      self.currentUser = data;
    });

    function windowWidthLess () {
      return $(window).width() < 459;
    }

    function checkbox (bool) {
      $('.main-checkbox').prop('checked', bool);
    }

    function changeHeight (height) {
      $('.header-index').css({
        'height': height + 'px'
      });
      $('.site-header').css({
        'height': height + 'px'
      });
    }

    $('.for-clicking').on('click', function () {
      if (windowWidthLess()) {
        console.log('hey');
        checkbox(true);
        changeHeight(150);
        if ($('.header-left').length === 5) {
          changeHeight(180);
        }
      }
    });

    if ($(window).width() > 460) {
      $('.for-clicking').hide();
    }

    $(window).resize(function() {
      if ($(window).width() > 460) {
        $('.for-clicking').hide();
      }
    });

    $(window).resize(function() {
        if (windowWidthLess()) {
          checkbox(false);
          $('.for-clicking').show();
          changeHeight(50);
        }
    });

    $('.header-left').on('click', function () {
      if (windowWidthLess()) {
        checkbox(false);
        changeHeight(50);
        $('.site-header').animate({
          'height': '50px',
        }, 500);
      }
    });
  }]);

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

app.factory('VoteFactory', ['shareService', function (shareService) {

	var ups;
	var downs;

	function getVotes (votes, dir, rgb) {
		console.log(votes);
		var newVotes = votes + 1;
		console.log(newVotes);
		var el = $(event.target).parent().find('.fa-arrow-' + dir);
		if (el.css('color') !== rgb) {
			$(event.target).parent().find('.' + dir +'vote-count').html(dir + 'votes: ' + newVotes);
		}
	}

	function upvote (color, id, upvotes, downvotes) {
		getVotes(upvotes, 'up', 'rgb(0, 0, 255)');
		ups = (upvotes + 1);
		console.log(ups);
		event.target.style.color = color;
		var downEl = $(event.target).parent().find('.fa-arrow-down');
		if (downEl.css('color') === 'rgb(255, 165, 0)') {
			downEl.css({
				'color': 'lightgray'
			});
			shareService.undovote(id, 'down', (downs - 1));
		}
		shareService.upvote(id);
	}

	function downvote (color, id, downvotes, upvotes) {
		getVotes(downvotes, 'down', 'rgb(255, 165, 0)');
		downs = (downvotes + 1);
		event.target.style.color = color;

		console.log(ups);
		var upEl = $(event.target).parent().find('.fa-arrow-up');
		if (upEl.css('color') === 'rgb(0, 0, 255)') {
			// upEl.css({
			// 	'color': 'lightgray'
			// });
			console.log(ups);
			eraseVote(id, 'up', (ups - 1));
		}
		shareService.downvote(id);
	}

	function eraseVote (id, dir, votes) {
		var el = $(event.target).parent().find('.fa-arrow-' + dir);
		el.css({'color': 'lightgray'});
		$(event.target).parent().find('.' + dir +'vote-count').html(dir + 'votes: ' + votes);
		shareService.undovote(id);
	}

	return {
		vote: function (color, voted, id, upvotes, downvotes) {
		    if (voted === 'upvote' && (event.target.style.color === 'blue')) {
		    	eraseVote(id, 'up', upvotes);
		    } else if (voted === 'downvote' && (event.target.style.color === 'orange')) {
		    	eraseVote(id,'down', downvotes);
		    } else if (voted === 'upvote') {
		    	upvote(color, id, upvotes, downvotes);
		    } else if (voted === 'downvote') {
		    	downvote(color, id, downvotes, upvotes);
		    }
	    }
	};

}]);

app.factory('Comment', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId,
      text: spec.text,
      subjectId: spec.shareId,
      created: Date.now()
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['VoteFactory', function (VoteFactory) {
  // TODO: load these via AJAX
  var self = this;

  self.shares = [];

  // self.chosen;
  // self.upCounter = 0;
  // self.downCounter = 0;

  // self.vote = function (direction) {
  // 	self.chosen = direction;
  // };

  // self.vote = function (color, vote) {
  // 	// document.querySelector(el).onclick = function () {
	 //  	event.target.style.color = color
	 //  // }
  //   if (vote = 'upvote') {

  //   }
  // }

  self.vote = function (color, voted) {
    VoteFactory.vote(color, voted);
  };

  // todo:
  // -add an upvote and downvote counter to each li. Need to create a function within whatever Ashley is pushing to an array
  // that you can access. With that access, you'll need to create the function in your VoteFactory, probably using dependency
  // injection from her controller. The details page should have something like "upvotes= {{upvotes}}".


}]);

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
    console.log(self.share);
  };

}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/share.html',
    controller: 'ShareCtrl',
    controllerAs: 'vm',
    resolve: {
      share: ['$route', 'Comment', 'shareService', function ($route, Comment, shareService) {
        var routeParams = $route.current.params;
        console.log(routeParams.shareid);
        return shareService.getByShareId(routeParams.shareid);
      }],
      comments: ['$route', 'shareService', function ($route, shareService) {
        var routeParams = $route.current.params;
        return shareService.listComments(routeParams.shareid);
      }]
    }
  };

  $routeProvider.when('/shares/:shareid', routeDefinition);
  $routeProvider.when('/shares/:shareid/comments', routeDefinition);
}]).controller('ShareCtrl', ['share', 'shareService', 'Comment', 'comments', function (share, shareService, Comment, comments) {
  var self = this;

  self.share = share;
  self.comments = comments;
  self.comment = Comment();

  self.addComment = function () {
    shareService.addComment(self.comment);
  };

  self.listComments = function () {
    shareService.listComments(self.share._id);
  };

}]);


app.factory('Share', function () {
  return function (spec) {
    spec = spec || {};
    return {
      url: spec.url,
      description: spec.description,
      upvotes: spec.upvotes,
      downvotes: spec.downvotes
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['shareService', function (shareService) {
        return shareService.list();
      }],
      users: ['usersService', function (usersService) {
        return usersService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shareService', 'users', 'shares', '$route', 'Share', 'VoteFactory',
  function (shareService, users, shares, $route, Share, VoteFactory) {

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
    VoteFactory.vote(color, voted, id, upvotes, downvotes);
  };

  self.delete = function (shareId) {
    shareService.deleteShare(shareId).then($route.reload());
  };

  self.view = function (shareId) {
    shareService.getShareById(shareId).then();
  //ng-hide a copy of the form, ng-repeat(?) to populate the form with current share information which is retrieved by
  //id when the edit button is ng-click(ed).  Haha.  Submit button submits the form.  The API has function to deal deal
  //with duplicate user.  It states to replace current info with new info.
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
        console.log(routeParams.userid);
        return usersService.getByUserId(routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', function (user) {
  this.user = user;
  console.log(user);
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
        //Returns a list of users as an array..
      }],

      currentUser: ['usersService', function (usersService) {
        return usersService.currentUser();
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'currentUser', 'usersService', 'User', function (users, currentUser, usersService, User) {
  var self = this;

  self.users = users;
  console.log(users);

  self.currentUser = currentUser;

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

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

//Share Store, call AJAX

app.factory('shareService', ['$http', '$log', function ($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, share) {
    return processAjaxPromise($http.post(url, share));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
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

    getByShareId: function (shareId) {
      return get('/api/res/' + shareId);
    },

    getVotes: function (shareId) {
      return get('/api/res/' + shareId + '/votes');
    },

    addShare: function (share) {
      return post('/api/res', share);
    },

    deleteShare: function (shareId) {
      return remove('/api/res/' + shareId);
    },

    upvote: function (shareId) {
      return post('/api/res/' + shareId + '/votes', {vote:1});
    },

    downvote: function (shareId) {
      return post('/api/res/' + shareId + '/votes', {vote:-1});
    },

    undovote: function (shareId) {
      return post('/api/res/' + shareId + '/votes', {vote:0});
    },

    listComments: function (shareId) {
      return get('/api/res/' + shareId + '/comments');
    },

    addComment: function (shareId, comment) {
      return post('/api/res' + shareId + '/comments');

    },

    deleteComment: function (shareId, comment) {
      return delete('/api/res/' + shareId + '/comments/:id');
    },

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
    },

    currentUser: function () {
      return get('/api/users/me');
    }
  };
}]);

//# sourceMappingURL=app.js.map