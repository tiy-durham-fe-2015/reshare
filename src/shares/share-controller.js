app.config(['$routeProvider',
    function($routeProvider) {
        var routeDefinition = {
            templateUrl: 'shares/share.html',
            controller: 'ShareCtrl',
            controllerAs: 'vm',
            resolve: {
                share: ['$route', 'Comment', 'shareService',
                    function($route, Comment, shareService) {
                        var routeParams = $route.current.params;
                        console.log(routeParams.shareid);
                        return shareService.getByShareId(routeParams.shareid);
                    }
                ],
                comments: ['$route', 'shareService',
                    function($route, shareService) {
                        var routeParams = $route.current.params;
                        return shareService.listComments(routeParams.shareid);
                    }
                ]
            }
        };

        $routeProvider.when('/shares/:shareid', routeDefinition);
        $routeProvider.when('/shares/:shareid/comments', routeDefinition);
    }
]).controller('ShareCtrl', ['share', 'shareService', 'Comment', 'comments',
    function(share, shareService, Comment, comments) {
        var self = this;

        self.share = share;
        self.comments = comments;
        self.comment = Comment();

        self.addComment = function() {
            shareService.addComment(self.share._id, self.comment).then(function(comment) {
                self.comments.push(comment);
                self.comment.text = '';
            });
        };

        self.listComments = function() {
            shareService.listComments(self.share._id);
        };

    }
]);