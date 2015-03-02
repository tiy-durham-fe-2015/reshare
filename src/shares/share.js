
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
