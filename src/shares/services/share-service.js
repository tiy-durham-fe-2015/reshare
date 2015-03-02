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
      return post('/api/res/' + shareId + '/votes', {vote:1})
    },

    downvote: function (shareId) {
      return post('/api/res/' + shareId + '/votes', {vote:-1})
    },

    undovote: function (shareId) {
      return post('/api/res/' + shareId + '/votes', {vote:0})
    }

  };
}]);
