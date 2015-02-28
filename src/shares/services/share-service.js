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
    }
  };
}]);
