
app.factory('Share', function () {
  return function (spec) {
    spec = spec || {};
    return {
      url: spec.url,
      description: spec.description,
      upvoteCounter: spec.upvoteCounter,
      downvoteCounter: spec.downvoteCounter
    };
  };
});
